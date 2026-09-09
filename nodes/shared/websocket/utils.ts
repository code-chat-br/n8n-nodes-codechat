import type { CodeChatWebSocketScope, CodeChatWebSocketUrlConfig } from './types';

const TRANSIENT_CLOSE_CODES = new Set([1000, 1001, 1011, 4008]);
const PERMANENT_CLOSE_CODES = new Set([1008, 4001, 4003]);
const PERMANENT_HANDSHAKE_STATUS_CODES = new Set([400, 401, 403, 404]);

export function toWebSocketBaseUrl(baseUrl: string): string {
	const url = new URL(baseUrl.trim());

	if (url.protocol === 'https:') {
		url.protocol = 'wss:';
	} else if (url.protocol === 'http:') {
		url.protocol = 'ws:';
	} else if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
		throw new Error('CodeChat Base URL must use http, https, ws, or wss protocol.');
	}

	url.search = '';
	url.hash = '';

	return url.toString().replace(/\/$/, '');
}

export function getEndpointPath(scope: CodeChatWebSocketScope): string {
	return scope === 'instance' ? '/ws/instance/events' : '/ws/global/events';
}

export function buildCodeChatWebSocketUrl(config: CodeChatWebSocketUrlConfig): string {
	const baseUrl = toWebSocketBaseUrl(config.baseUrl);
	const query = new URLSearchParams({
		event: config.event,
		token: config.token,
	});

	return `${baseUrl}${getEndpointPath(config.scope)}?${query.toString()}`;
}

export function sanitizeWebSocketUrl(url: string): string {
	const parsedUrl = new URL(url);

	if (parsedUrl.searchParams.has('token')) {
		parsedUrl.searchParams.set('token', '***');
	}

	return parsedUrl.toString();
}

export function isPermanentCloseCode(code: number): boolean {
	return PERMANENT_CLOSE_CODES.has(code);
}

export function isTransientCloseCode(code: number): boolean {
	return TRANSIENT_CLOSE_CODES.has(code);
}

export function isPermanentHandshakeStatusCode(statusCode?: number): boolean {
	return typeof statusCode === 'number' && PERMANENT_HANDSHAKE_STATUS_CODES.has(statusCode);
}

export function calculateReconnectDelay(
	attempt: number,
	baseDelayMs = 1000,
	maxDelayMs = 30000,
	jitterMs = 500,
	random = Math.random,
): number {
	const exponentialDelay = baseDelayMs * 2 ** Math.max(0, attempt - 1);
	const cappedDelay = Math.min(exponentialDelay, maxDelayMs);
	const jitter = Math.floor(random() * Math.max(0, jitterMs));

	return Math.min(cappedDelay + jitter, maxDelayMs);
}
