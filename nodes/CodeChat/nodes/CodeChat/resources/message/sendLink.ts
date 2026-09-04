import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendLink = {
	resource: ['message'],
	operation: ['sendLink'],
};

export const sendLinkDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendLink,
		},
		placeholder: '5531900000000',
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Link',
		name: 'link',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendLink,
		},
		placeholder: 'https://github.com/code-chat-br/whatsapp-api',
		description: 'URL to send',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendLink,
		},
		description: 'Title shown in the link preview',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendLink,
		},
		description: 'Description shown in the link preview',
	},
	{
		displayName: 'Thumbnail URL',
		name: 'thumbnailUrl',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendLink,
		},
		description: 'Image URL to use as the link preview thumbnail',
	},
	createMessageOptions({ show: showOnlyForSendLink }),
];
