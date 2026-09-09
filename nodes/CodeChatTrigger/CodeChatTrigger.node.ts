import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerFunctions,
	type ITriggerResponse,
} from 'n8n-workflow';
import { INSTANCE_EVENT_OPTIONS } from '../shared/websocket/events';
import { startCodeChatWebSocketTrigger } from '../shared/websocket/trigger';

export class CodeChatTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CodeChat Trigger',
		name: 'codeChatTrigger',
		icon: {
			light: 'file:../../icons/codechat.svg',
			dark: 'file:../../icons/codechat.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a CodeChat instance event occurs',
		defaults: {
			name: 'CodeChat Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'codeChatApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: INSTANCE_EVENT_OPTIONS,
				default: 'messages.upsert',
				required: true,
				description:
					'CodeChat instance event to listen for. One active trigger opens one WebSocket connection for this event.',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		return await startCodeChatWebSocketTrigger.call(this, {
			credentialName: 'codeChatApi',
			tokenPropertyName: 'accessToken',
			scope: 'instance',
		});
	}
}
