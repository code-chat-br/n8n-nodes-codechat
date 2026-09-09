import { sleep } from 'n8n-workflow';
import type {
	CodeChatWebSocketClientConfig,
	CodeChatWebSocketCloseEvent,
	CodeChatWebSocketConstructor,
	CodeChatWebSocketErrorEvent,
	CodeChatWebSocketLike,
	CodeChatWebSocketMessageEvent,
	CodeChatWebSocketPayload,
	CodeChatWebSocketState,
	RawWebSocketData,
} from './types';
import {
	buildCodeChatWebSocketUrl,
	calculateReconnectDelay,
	isPermanentCloseCode,
} from './utils';

declare const WebSocket: CodeChatWebSocketConstructor | undefined;

const CONNECTING_STATE = 0;
const OPEN_STATE = 1;
const DEFAULT_RECONNECT_BASE_DELAY_MS = 1000;
const DEFAULT_RECONNECT_MAX_DELAY_MS = 30000;
const DEFAULT_RECONNECT_JITTER_MS = 500;
const DEFAULT_HEARTBEAT_TIMEOUT_MS = 0;

export class CodeChatWebSocketClient {
	private readonly config: Required<
		Pick<
			CodeChatWebSocketClientConfig,
			'reconnectBaseDelayMs' | 'reconnectMaxDelayMs' | 'reconnectJitterMs' | 'heartbeatTimeoutMs'
		>
	> &
		Omit<
			CodeChatWebSocketClientConfig,
			'reconnectBaseDelayMs' | 'reconnectMaxDelayMs' | 'reconnectJitterMs' | 'heartbeatTimeoutMs'
		>;

	private socket: CodeChatWebSocketLike | undefined;

	private state: CodeChatWebSocketState = 'idle';

	private reconnectAttempt = 0;

	private reconnectScheduleId = 0;

	private heartbeatScheduleId = 0;

	private shouldReconnect = true;

	private permanentFailure = false;

	private readonly listeners = {
		open: () => this.handleOpen(),
		message: (event: CodeChatWebSocketMessageEvent) => this.handleMessage(event),
		error: (event: CodeChatWebSocketErrorEvent) => this.handleSocketError(event),
		close: (event: CodeChatWebSocketCloseEvent) => this.handleClose(event),
	};

	constructor(config: CodeChatWebSocketClientConfig) {
		this.config = {
			reconnectBaseDelayMs: config.reconnectBaseDelayMs ?? DEFAULT_RECONNECT_BASE_DELAY_MS,
			reconnectMaxDelayMs: config.reconnectMaxDelayMs ?? DEFAULT_RECONNECT_MAX_DELAY_MS,
			reconnectJitterMs: config.reconnectJitterMs ?? DEFAULT_RECONNECT_JITTER_MS,
			heartbeatTimeoutMs: config.heartbeatTimeoutMs ?? DEFAULT_HEARTBEAT_TIMEOUT_MS,
			...config,
		};
	}

	connect(): void {
		if (!this.shouldReconnect || this.state === 'closing' || this.state === 'closed') {
			return;
		}

		if (this.state === 'connecting' || this.state === 'connected') {
			return;
		}

		this.cancelReconnect();
		this.cancelHeartbeat();
		this.state = 'connecting';

		const url = buildCodeChatWebSocketUrl({
			baseUrl: this.config.baseUrl,
			event: this.config.event,
			scope: this.config.scope,
			token: this.config.token,
		});

		const socket =
			this.config.socketFactory?.(url) ?? new (this.getWebSocketConstructor())(url);

		this.socket = socket;

		socket.addEventListener('open', this.listeners.open);
		socket.addEventListener('message', this.listeners.message);
		socket.addEventListener('error', this.listeners.error);
		socket.addEventListener('close', this.listeners.close);
	}

	async close(): Promise<void> {
		if (this.state === 'closed') {
			return;
		}

		this.shouldReconnect = false;
		this.state = 'closing';
		this.cancelReconnect();
		this.cancelHeartbeat();

		const socket = this.socket;
		this.socket = undefined;

		if (socket) {
			this.removeSocketListeners(socket);

			if (socket.readyState === CONNECTING_STATE || socket.readyState === OPEN_STATE) {
				socket.close(1000, 'Client closed connection');
			} else {
				socket.terminate?.();
			}
		}

		this.state = 'closed';
	}

	getState(): CodeChatWebSocketState {
		return this.state;
	}

	hasReconnectTimer(): boolean {
		return this.reconnectScheduleId > 0 && this.state === 'reconnecting';
	}

	private handleOpen(): void {
		this.state = 'connected';
		this.reconnectAttempt = 0;
		this.resetHeartbeatWatch();
	}

	private handleMessage(event: CodeChatWebSocketMessageEvent): void {
		this.resetHeartbeatWatch();

		const serializedMessage = this.serializeMessage(event.data);

		try {
			const payload = JSON.parse(serializedMessage) as CodeChatWebSocketPayload;
			this.config.onMessage(payload);
		} catch (error) {
			this.config.onError?.(
				error instanceof Error
					? error
					: new Error('CodeChat WebSocket received an invalid JSON payload.'),
			);
		}
	}

	private handleSocketError(event: CodeChatWebSocketErrorEvent): void {
		if (this.state === 'closing' || this.state === 'closed') {
			return;
		}

		const error = this.toError(event);
		this.config.onError?.(error);
	}

	private handleClose(event: CodeChatWebSocketCloseEvent): void {
		this.cancelHeartbeat();

		if (this.socket) {
			this.removeSocketListeners(this.socket);
		}

		this.socket = undefined;

		if (this.state === 'closing' || this.state === 'closed') {
			this.state = 'closed';
			return;
		}

		if (this.permanentFailure || isPermanentCloseCode(event.code)) {
			const reasonText = event.reason ?? '';
			const suffix = reasonText ? `: ${reasonText}` : '';

			this.handlePermanentFailure(
				new Error(`CodeChat WebSocket closed with permanent code ${event.code}${suffix}.`),
			);
			return;
		}

		if (!this.shouldReconnect) {
			this.state = 'closed';
			return;
		}

		this.scheduleReconnect();
	}

	private handlePermanentFailure(error: Error): void {
		if (this.permanentFailure) {
			return;
		}

		this.permanentFailure = true;
		this.shouldReconnect = false;
		this.cancelReconnect();
		this.cancelHeartbeat();
		this.state = 'closed';
		this.config.onFatalError?.(error);
	}

	private scheduleReconnect(): void {
		if (!this.shouldReconnect || this.state === 'reconnecting') {
			return;
		}

		this.reconnectAttempt += 1;
		this.state = 'reconnecting';
		this.reconnectScheduleId += 1;
		const scheduleId = this.reconnectScheduleId;

		const delay = calculateReconnectDelay(
			this.reconnectAttempt,
			this.config.reconnectBaseDelayMs,
			this.config.reconnectMaxDelayMs,
			this.config.reconnectJitterMs,
		);

		void this.waitAndReconnect(scheduleId, delay);
	}

	private async waitAndReconnect(scheduleId: number, delay: number): Promise<void> {
		await sleep(delay);

		if (
			this.reconnectScheduleId === scheduleId &&
			this.shouldReconnect &&
			this.state === 'reconnecting'
		) {
			this.reconnectScheduleId = 0;
			this.connect();
		}
	}

	private resetHeartbeatWatch(): void {
		this.cancelHeartbeat();

		if (this.config.heartbeatTimeoutMs <= 0 || this.state === 'closing' || this.state === 'closed') {
			return;
		}

		this.heartbeatScheduleId += 1;
		void this.waitForHeartbeat(this.heartbeatScheduleId);
	}

	private async waitForHeartbeat(scheduleId: number): Promise<void> {
		await sleep(this.config.heartbeatTimeoutMs);

		if (this.heartbeatScheduleId === scheduleId && this.socket && this.state === 'connected') {
			if (this.socket.terminate) {
				this.socket.terminate();
			} else {
				this.socket.close(1001, 'Heartbeat timeout');
			}
		}
	}

	private cancelReconnect(): void {
		this.reconnectScheduleId = 0;
	}

	private cancelHeartbeat(): void {
		this.heartbeatScheduleId = 0;
	}

	private serializeMessage(data: RawWebSocketData): string {
		if (typeof data === 'string') {
			return data;
		}

		if (Array.isArray(data)) {
			return Buffer.concat(data).toString('utf8');
		}

		if (data instanceof ArrayBuffer) {
			return Buffer.from(new Uint8Array(data)).toString('utf8');
		}

		if (Buffer.isBuffer(data)) {
			return data.toString('utf8');
		}

		return String(data);
	}

	private removeSocketListeners(socket: CodeChatWebSocketLike): void {
		socket.removeEventListener('open', this.listeners.open);
		socket.removeEventListener('message', this.listeners.message);
		socket.removeEventListener('error', this.listeners.error);
		socket.removeEventListener('close', this.listeners.close);
	}

	private getWebSocketConstructor(): CodeChatWebSocketConstructor {
		if (typeof WebSocket === 'undefined') {
			throw new Error('WebSocket is not available in this n8n runtime.');
		}

		return WebSocket;
	}

	private toError(event: CodeChatWebSocketErrorEvent): Error {
		if (event.error instanceof Error) {
			return event.error;
		}

		return new Error(event.message ?? 'CodeChat WebSocket connection error.');
	}
}
