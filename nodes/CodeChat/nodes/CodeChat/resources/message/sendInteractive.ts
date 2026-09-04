import type { INodeProperties } from 'n8n-workflow';

import { createMediaUploadId, createMessageOptions } from './shared';

const buttonTypeOptions = [
	{
		name: 'Copy Code',
		value: 'copyCode',
	},
	{
		name: 'Reply ID',
		value: 'id',
	},
	{
		name: 'URL',
		value: 'url',
	},
];

function createButtonMessageFields(operation: string): INodeProperties[] {
	const show = {
		resource: ['message'],
		operation: [operation],
	};

	return [
		{
			displayName: 'Chat',
			name: 'chat',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show,
			},
			description: 'Recipient chat ID or phone number including country and area code',
		},
		createMediaUploadId({ show }),
		{
			displayName: 'Title',
			name: 'title',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show,
			},
			description: 'Title of the button message',
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
				show,
			},
			description: 'Description of the button message',
		},
		{
			displayName: 'Footer Text',
			name: 'footerText',
			type: 'string',
			default: '',
			displayOptions: {
				show,
			},
			description: 'Footer text of the button message',
		},
		{
			displayName: 'Buttons',
			name: 'buttons',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			required: true,
			displayOptions: {
				show,
			},
			options: [
				{
					displayName: 'Button',
					name: 'button',
					values: [
						{
							displayName: 'Display Text',
							name: 'displayText',
							type: 'string',
							default: '',
							required: true,
							description: 'Text displayed on the button',
						},
						{
							displayName: 'Type',
							name: 'type',
							type: 'options',
							options: buttonTypeOptions,
							default: 'url',
							description: 'Action type for the button',
						},
						{
							displayName: 'Value',
							name: 'value',
							type: 'string',
							default: '',
							required: true,
							description: 'Button ID, URL, or copy code depending on the selected type',
						},
					],
				},
			],
			description: 'Buttons to include in the message',
		},
		createMessageOptions({ show }),
	];
}

export const sendButtonsDescription = createButtonMessageFields('sendButtons');
export const sendReplyDescription = createButtonMessageFields('sendReply');
export const sendUrlDescription = createButtonMessageFields('sendUrl');
export const sendCopyDescription = createButtonMessageFields('sendCopy');
