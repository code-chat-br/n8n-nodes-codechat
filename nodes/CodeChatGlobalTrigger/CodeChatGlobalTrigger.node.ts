import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerFunctions,
	type ITriggerResponse,
} from 'n8n-workflow';
import { GLOBAL_EVENT_OPTIONS } from '../shared/websocket/events';
import { startCodeChatWebSocketTrigger } from '../shared/websocket/trigger';

export class CodeChatGlobalTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CodeChat Global Trigger',
		name: 'codeChatGlobalTrigger',
		icon: {
			light: 'file:../../icons/codechat.svg',
			dark: 'file:../../icons/codechat.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a global CodeChat event occurs',
		defaults: {
			name: 'CodeChat Global Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'codeChatUserApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: GLOBAL_EVENT_OPTIONS,
				default: 'message.batch.completed',
				required: true,
				description:
					'CodeChat global event to listen for. One active trigger opens one WebSocket connection for this event.',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		return await startCodeChatWebSocketTrigger.call(this, {
			credentialName: 'codeChatUserApi',
			tokenPropertyName: 'userToken',
			scope: 'global',
		});
	}
}
