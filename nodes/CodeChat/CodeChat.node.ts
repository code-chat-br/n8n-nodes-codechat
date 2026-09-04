import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { executeCall } from './nodes/CodeChat/resources/call/execute';
import { callDescription } from './nodes/CodeChat/resources/call';
import { executeChat } from './nodes/CodeChat/resources/chat/execute';
import { chatDescription } from './nodes/CodeChat/resources/chat';
import { executeGroup } from './nodes/CodeChat/resources/group/execute';
import { groupDescription } from './nodes/CodeChat/resources/group';
import { executeInstance } from './nodes/CodeChat/resources/instance/execute';
import { instanceDescription } from './nodes/CodeChat/resources/instance';
import { executeMedia } from './nodes/CodeChat/resources/media/execute';
import { mediaDescription } from './nodes/CodeChat/resources/media';
import { executeMessage } from './nodes/CodeChat/resources/message/execute';
import { messageDescription } from './nodes/CodeChat/resources/message';
import { executeWebhook } from './nodes/CodeChat/resources/webhook/execute';
import { webhookDescription } from './nodes/CodeChat/resources/webhook';

export class CodeChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CodeChat',
		name: 'codeChat',
		icon: {
			light: 'file:../../icons/codechat.svg',
			dark: 'file:../../icons/codechat.dark.svg',
		},
		group: ['output'],
		version: 1,

		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',

		description: 'Interact with the CodeChat WhatsApp API',

		defaults: {
			name: 'CodeChat',
		},

		usableAsTool: true,

		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],

		credentials: [
			{
				name: 'codeChatApi',
				required: true,
			},
		],

		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,

				options: [
					{
						name: 'Call',
						value: 'call',
					},
					{
						name: 'Chat',
						value: 'chat',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Instance',
						value: 'instance',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],

				default: 'instance',
			},

			...callDescription,
			...instanceDescription,
			...chatDescription,
			...messageDescription,
			...mediaDescription,
			...groupDescription,
			...webhookDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;

		if (resource === 'call') {
			return await executeCall.call(this);
		}

		if (resource === 'chat') {
			return await executeChat.call(this);
		}

		if (resource === 'group') {
			return await executeGroup.call(this);
		}

		if (resource === 'instance') {
			return await executeInstance.call(this);
		}

		if (resource === 'message') {
			return await executeMessage.call(this);
		}

		if (resource === 'media') {
			return await executeMedia.call(this);
		}

		if (resource === 'webhook') {
			return await executeWebhook.call(this);
		}

		return [[]];
	}
}
