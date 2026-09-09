import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ITriggerFunctions,
	type ITriggerResponse,
} from 'n8n-workflow';
import { CALL_EVENT_OPTIONS } from '../shared/websocket/events';
import { startCodeChatWebSocketTrigger } from '../shared/websocket/trigger';

export class CodeChatCallsTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CodeChat Calls Trigger',
		name: 'codeChatCallsTrigger',
		icon: {
			light: 'file:../../icons/codechat.svg',
			dark: 'file:../../icons/codechat.dark.svg',
		},
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when a CodeChat call event occurs',
		defaults: {
			name: 'CodeChat Calls Trigger',
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
				options: CALL_EVENT_OPTIONS,
				default: 'call.incoming',
				required: true,
				description:
					'CodeChat call event to listen for. Uses the JSON event WebSocket, not the binary call media WebSocket.',
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
