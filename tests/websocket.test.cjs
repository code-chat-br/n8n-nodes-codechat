const { EventEmitter } = require('node:events');
const assert = require('node:assert/strict');
const test = require('node:test');
const { setTimeout: delay } = require('node:timers/promises');

const {
	buildCodeChatWebSocketUrl,
	calculateReconnectDelay,
	isPermanentCloseCode,
	isPermanentHandshakeStatusCode,
	sanitizeWebSocketUrl,
	toWebSocketBaseUrl,
} = require('../dist/nodes/shared/websocket/utils');
const { CodeChatWebSocketClient } = require('../dist/nodes/shared/websocket/CodeChatWebSocketClient');

const wait = async (ms) => {
	await delay(ms);
};

class FakeSocket extends EventEmitter {
	constructor() {
		super();
		this.readyState = 0;
		this.closed = false;
		this.terminated = false;
	}

	open() {
		this.readyState = 1;
		this.emit('open');
	}

	addEventListener(event, listener) {
		this.on(event, listener);
	}

	removeEventListener(event, listener) {
		this.off(event, listener);
	}

	close(code = 1000, reason = 'Client closed connection') {
		this.closed = true;
		this.readyState = 3;
		this.emit('close', { code, reason });
	}

	terminate() {
		this.terminated = true;
		this.readyState = 3;
		this.emit('close', { code: 1006 });
	}
}

test('converts HTTP base URLs to WebSocket base URLs', () => {
	assert.equal(toWebSocketBaseUrl('https://api.example.com'), 'wss://api.example.com');
	assert.equal(toWebSocketBaseUrl('http://localhost:8084'), 'ws://localhost:8084');
	assert.equal(toWebSocketBaseUrl('https://api.example.com/'), 'wss://api.example.com');
});

test('builds instance and global event URLs with query authentication', () => {
	assert.equal(
		buildCodeChatWebSocketUrl({
			baseUrl: 'https://api.example.com',
			scope: 'instance',
			event: 'messages.upsert',
			token: 'instance.jwt',
		}),
		'wss://api.example.com/ws/instance/events?event=messages.upsert&token=instance.jwt',
	);

	assert.equal(
		buildCodeChatWebSocketUrl({
			baseUrl: 'https://api.example.com',
			scope: 'global',
			event: 'message.batch.completed',
			token: 'user.jwt',
		}),
		'wss://api.example.com/ws/global/events?event=message.batch.completed&token=user.jwt',
	);
});

test('caps reconnect delay at 30 seconds', () => {
	assert.equal(calculateReconnectDelay(10, 1000, 30000, 500, () => 0.99), 30000);
});

test('sanitizes token query parameter before logging URLs', () => {
	assert.equal(
		sanitizeWebSocketUrl('wss://api.example.com/ws/instance/events?event=messages.upsert&token=secret.jwt'),
		'wss://api.example.com/ws/instance/events?event=messages.upsert&token=***',
	);
});

test('classifies permanent WebSocket authentication failures', () => {
	assert.equal(isPermanentCloseCode(4001), true);
	assert.equal(isPermanentCloseCode(4003), true);
	assert.equal(isPermanentHandshakeStatusCode(401), true);
	assert.equal(isPermanentHandshakeStatusCode(403), true);
	assert.equal(isPermanentHandshakeStatusCode(500), false);
});

test('reconnects after unexpected close', async () => {
	const sockets = [];
	const client = new CodeChatWebSocketClient({
		baseUrl: 'https://api.example.com',
		scope: 'instance',
		event: 'messages.upsert',
		token: 'instance.jwt',
		reconnectBaseDelayMs: 1,
		reconnectMaxDelayMs: 30,
		reconnectJitterMs: 0,
		heartbeatTimeoutMs: 0,
		onMessage: () => {},
		socketFactory: () => {
			const socket = new FakeSocket();
			sockets.push(socket);
			return socket;
		},
	});

	client.connect();
	sockets[0].open();
	sockets[0].emit('close', { code: 1006 });

	await wait(10);

	assert.equal(sockets.length, 2);
	assert.equal(client.getState(), 'connecting');

	await client.close();
});

test('close cancels pending reconnect and disables future reconnects', async () => {
	const sockets = [];
	const client = new CodeChatWebSocketClient({
		baseUrl: 'https://api.example.com',
		scope: 'instance',
		event: 'messages.upsert',
		token: 'instance.jwt',
		reconnectBaseDelayMs: 20,
		reconnectJitterMs: 0,
		heartbeatTimeoutMs: 0,
		onMessage: () => {},
		socketFactory: () => {
			const socket = new FakeSocket();
			sockets.push(socket);
			return socket;
		},
	});

	client.connect();
	sockets[0].open();
	sockets[0].emit('close', { code: 1006 });

	assert.equal(client.hasReconnectTimer(), true);

	await client.close();
	await wait(30);

	assert.equal(client.hasReconnectTimer(), false);
	assert.equal(sockets.length, 1);
	assert.equal(client.getState(), 'closed');
});

test('invalid JSON reports a non-fatal error and keeps the socket open', () => {
	let errors = 0;
	let messages = 0;
	const socket = new FakeSocket();
	const client = new CodeChatWebSocketClient({
		baseUrl: 'https://api.example.com',
		scope: 'instance',
		event: 'messages.upsert',
		token: 'instance.jwt',
		heartbeatTimeoutMs: 0,
		onMessage: () => {
			messages += 1;
		},
		onError: () => {
			errors += 1;
		},
		socketFactory: () => socket,
	});

	client.connect();
	socket.open();
	socket.emit('message', { data: '{invalid' });

	assert.equal(errors, 1);
	assert.equal(messages, 0);
	assert.equal(client.getState(), 'connected');
});

test('cleanup closes socket, removes listeners, and clears reconnect timer', async () => {
	const socket = new FakeSocket();
	const client = new CodeChatWebSocketClient({
		baseUrl: 'https://api.example.com',
		scope: 'instance',
		event: 'messages.upsert',
		token: 'instance.jwt',
		reconnectBaseDelayMs: 20,
		reconnectJitterMs: 0,
		heartbeatTimeoutMs: 0,
		onMessage: () => {},
		socketFactory: () => socket,
	});

	client.connect();
	socket.open();

	await client.close();

	assert.equal(socket.closed, true);
	assert.equal(client.hasReconnectTimer(), false);
	assert.equal(client.getState(), 'closed');
	assert.equal(socket.listenerCount('message'), 0);
});
