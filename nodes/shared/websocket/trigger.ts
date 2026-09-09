import type { ITriggerFunctions, ITriggerResponse } from 'n8n-workflow';
import { CodeChatWebSocketClient } from './CodeChatWebSocketClient';
import type { CodeChatWebSocketScope } from './types';

interface StartCodeChatWebSocketTriggerConfig {
	credentialName: string;
	tokenPropertyName: string;
	scope: CodeChatWebSocketScope;
	eventParameterName?: string;
}

export async function startCodeChatWebSocketTrigger(
	this: ITriggerFunctions,
	config: StartCodeChatWebSocketTriggerConfig,
): Promise<ITriggerResponse> {
	const credentials = await this.getCredentials(config.credentialName);
	const event = this.getNodeParameter(config.eventParameterName ?? 'event') as string;
	const tokenValue = credentials[config.tokenPropertyName];
	const baseUrl = credentials.baseUrl;

	if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
		throw new Error('CodeChat Base URL is required.');
	}

	if (typeof tokenValue !== 'string' || tokenValue.trim() === '') {
		throw new Error('CodeChat WebSocket token is required.');
	}

	const client = new CodeChatWebSocketClient({
		baseUrl,
		event,
		scope: config.scope,
		token: tokenValue,
		onMessage: (payload) => {
			this.emit([this.helpers.returnJsonArray([payload])]);
		},
		onError: (error) => {
			this.logger.warn('CodeChat WebSocket non-fatal error', {
				error: error.message,
				event,
				scope: config.scope,
			});
		},
		onFatalError: (error) => {
			this.emitError(error);
		},
	});

	client.connect();

	return {
		closeFunction: async () => {
			await client.close();
		},
	};
}
