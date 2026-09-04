import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendPpt = {
	resource: ['message'],
	operation: ['sendPpt'],
};

export const sendPptDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPpt,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Audio URL',
		name: 'audio',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPpt,
		},
		description: 'URL of the audio file to send as a push-to-talk message',
	},
	createMessageOptions({ show: showOnlyForSendPpt }),
];
