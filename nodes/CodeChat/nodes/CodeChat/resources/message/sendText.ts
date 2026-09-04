import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendText = {
	resource: ['message'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,

		displayOptions: {
			show: showOnlyForSendText,
		},

		placeholder: '55319111111',

		description: 'Recipient chat ID or phone number including country and area code',
	},

	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		default: '',
		required: true,

		typeOptions: {
			rows: 4,
		},

		displayOptions: {
			show: showOnlyForSendText,
		},

		placeholder: 'Hello!',
		description: 'Text message to send',
	},

	createMessageOptions({ show: showOnlyForSendText }),
];
