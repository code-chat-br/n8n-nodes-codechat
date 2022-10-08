import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { codechatFields } from './CodeChat.fields';

export class CodeChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CodeChat - WhatsApp Api Cloud',
		name: 'codechat',
		icon: 'file:codechat.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Rest api for communication with WhatsApp',
		defaults: { name: 'CodeChat' },
		credentials: [{ name: 'codeChatApi', required: true }],
		inputs: ['main'],
		outputs: ['main'],
		requestDefaults: { baseURL: '={{$credentials.baseUrl}}' },
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Message', value: 'message' },
					{ name: 'Group', value: 'group' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Payment', value: 'payment' },
					{ name: 'Business', value: 'business' },
				],
				default: 'message',
			},

			...codechatFields,
		],
	};
}
