import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';
import { mediaTypeOptions } from './sendMedia';

const showOnlyForSendMediaFile = {
	resource: ['message'],
	operation: ['sendMediaFile'],
};

export const sendMediaFileDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendMediaFile,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: mediaTypeOptions,
		default: 'image',
		required: true,
		displayOptions: {
			show: showOnlyForSendMediaFile,
		},
		description: 'Type of media to send',
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForSendMediaFile,
		},
		description: 'Name of the input binary field containing the attachment',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendMediaFile,
		},
		description: 'Caption to send with the media',
	},
	createMessageOptions({ show: showOnlyForSendMediaFile }),
];
