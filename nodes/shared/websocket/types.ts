import type { IDataObject } from 'n8n-workflow';

export type CodeChatWebSocketScope = 'instance' | 'global';

export type CodeChatWebSocketState =
	| 'idle'
	| 'connecting'
	| 'connected'
	| 'reconnecting'
	| 'closing'
	| 'closed';

export interface CodeChatWebSocketPayload extends IDataObject {
	event?: string;
	instance?: IDataObject | string;
	instanceId?: number;
	call?: IDataObject;
	data?: IDataObject;
	sequence?: number;
	timestamp?: string;
}

export interface CodeChatCallEventPayload extends CodeChatWebSocketPayload {
	call?: IDataObject;
}

export interface CodeChatWebSocketUrlConfig {
	baseUrl: string;
	event: string;
	scope: CodeChatWebSocketScope;
	token: string;
}

export type RawWebSocketData = ArrayBuffer | Buffer | Buffer[] | string | unknown;

export interface CodeChatWebSocketLike {
	readyState: number;
	addEventListener(event: 'open', listener: () => void): void;
	addEventListener(event: 'message', listener: (event: CodeChatWebSocketMessageEvent) => void): void;
	addEventListener(event: 'error', listener: (event: CodeChatWebSocketErrorEvent) => void): void;
	addEventListener(event: 'close', listener: (event: CodeChatWebSocketCloseEvent) => void): void;
	removeEventListener(event: 'open', listener: () => void): void;
	removeEventListener(event: 'message', listener: (event: CodeChatWebSocketMessageEvent) => void): void;
	removeEventListener(event: 'error', listener: (event: CodeChatWebSocketErrorEvent) => void): void;
	removeEventListener(event: 'close', listener: (event: CodeChatWebSocketCloseEvent) => void): void;
	close(code?: number, reason?: string): void;
	terminate?: () => void;
}

export interface CodeChatWebSocketMessageEvent {
	data: RawWebSocketData;
}

export interface CodeChatWebSocketErrorEvent {
	error?: unknown;
	message?: string;
}

export interface CodeChatWebSocketCloseEvent {
	code: number;
	reason?: string;
}

export type CodeChatWebSocketConstructor = new (url: string) => CodeChatWebSocketLike;

export type CodeChatWebSocketFactory = (url: string) => CodeChatWebSocketLike;

export interface CodeChatWebSocketClientConfig {
	baseUrl: string;
	event: string;
	scope: CodeChatWebSocketScope;
	token: string;
	onMessage: (payload: CodeChatWebSocketPayload) => void;
	onError?: (error: Error) => void;
	onFatalError?: (error: Error) => void;
	socketFactory?: CodeChatWebSocketFactory;
	reconnectBaseDelayMs?: number;
	reconnectMaxDelayMs?: number;
	reconnectJitterMs?: number;
	heartbeatTimeoutMs?: number;
}
