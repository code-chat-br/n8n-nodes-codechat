import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendPptFile = {
	resource: ['message'],
	operation: ['sendPptFile'],
};

export const sendPptFileDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPptFile,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForSendPptFile,
		},
		description: 'Name of the input binary field containing the audio attachment',
	},
	createMessageOptions({ show: showOnlyForSendPptFile }),
];
