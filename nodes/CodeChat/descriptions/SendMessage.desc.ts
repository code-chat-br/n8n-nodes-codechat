import { INodeProperties } from 'n8n-workflow';
import {
	prepareShippingOptions,
	sendButtonsMessage,
	sendTemplateMessage,
	sendTextMessage,
	shippingURL,
} from '../Generic.func';

export const optionsProperties: INodeProperties[] = [
	{
		displayName: 'Quote Message',
		name: 'quoted',
		required: false,
		default: '',
		hint: 'Enter the ID of the message you want to quote',
		placeholder: 'messageId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
		routing: { send: { type: 'body', property: 'options.quoted' } },
	},

	{
		displayName: 'Mention Contact',
		name: 'mentioned',
		required: false,
		default: '',
		hint: 'Insert a list with the contact(s) of the user(s) to be mentioned.',
		description: 'Mentions in both group chats and simple chats.',
		placeholder: `[Array:['5531900000000, '5521911111111']]`,
		type: 'json',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
		routing: { send: { type: 'body', property: 'options.mentioned' } },
	},

	{
		displayName: 'Delay Message',
		name: 'delayMessage',
		required: false,
		default: '',
		description: 'Enter the delay with which each message will be delivered.',
		placeholder: '1200 milliseconds',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
		routing: {
			send: { type: 'body', property: 'options.delay', preSend: [prepareShippingOptions] },
		},
	},
];

export const textProperties: INodeProperties[] = [
	{
		displayName: 'Text Message',
		name: 'textProperty',
		required: true,
		default: '',
		description: 'The body of the message (max 4096 characters)',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['text'],
			},
		},
		routing: {
			send: { type: 'body', property: 'text', preSend: [sendTextMessage] },
			request: { url: '=' + shippingURL('message', 'sendText'), method: 'POST' },
		},
	},
];

export const buttonsProperties: INodeProperties[] = [
	{
		displayName: 'Button Title',
		name: 'buttonTitleProperty',
		required: true,
		default: '',
		hint: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
		routing: {
			send: { type: 'body', property: 'buttonsMessage.title' },
		},
	},

	{
		displayName: 'Button Description',
		name: 'buttonDescProperty',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
		routing: {
			send: { type: 'body', property: 'buttonsMessage.description' },
		},
	},

	{
		displayName: 'Button Footer Text',
		name: 'buttonFooterProperty',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
		routing: {
			send: { type: 'body', property: 'buttonsMessage.footerText' },
		},
	},

	{
		displayName: 'Button Field Type',
		name: 'buttonFieldTypeProperty',
		required: true,
		noDataExpression: true,
		placeholder: '',
		type: 'options',
		options: [
			{ name: 'Collection', value: 'collection' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'collection',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
	},

	{
		displayName: 'Collection Field',
		name: 'collectionProperty',
		required: true,
		placeholder: 'Add Reply Buttons',
		type: 'fixedCollection',
		default: '',
		typeOptions: { multipleValues: true, maxValue: 3 },
		description: '',
		options: [
			{
				displayName: 'Reply Buttons',
				name: 'replyButtons',
				values: [
					{
						displayName: 'Display Text',
						name: 'displayText',
						type: 'string',
						default: '',
						description: 'Unique text per button',
						required: true,
					},
					{
						displayName: 'Button ID',
						name: 'buttonId',
						type: 'string',
						default: '',
						description: 'Unique ID per button',
						required: true,
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
				buttonFieldTypeProperty: ['collection'],
			},
		},
		routing: { send: { type: 'body', property: 'buttons' } },
	},

	{
		displayName: 'JSON Field',
		name: 'jsonProperty',
		required: true,
		placeholder: `[Array:[{displayText: 'Button Text', buttonId: 'btnId01'}]]`,
		type: 'json',
		default: [],
		description: 'Map a json directly to this field',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
				buttonFieldTypeProperty: ['json'],
			},
		},
		routing: { send: { type: 'body', property: 'buttonsMessage.buttons' } },
	},

	{
		displayName: 'Media Message',
		name: 'mediaMessageProperty',
		placeholder: 'Add Media Message',
		type: 'fixedCollection',
		default: '',
		typeOptions: { multipleValues: false },
		description: 'Embed media message to button',
		options: [
			{
				displayName: 'Media Message',
				name: 'embedMediaMessage',
				values: [
					{
						displayName: 'Media Type',
						name: 'mediaType',
						required: true,
						type: 'options',
						options: [
							{ name: 'Image', value: 'image' },
							{ name: 'Document', value: 'document' },
							{ name: 'Video', value: 'video' },
							{ name: 'Sticker', value: 'sticker' },
						],
						default: 'image',
						routing: { send: { type: 'body', property: 'mediaData.type' } },
					},
					{
						displayName: 'Media Source',
						name: 'mediaSource',
						required: true,
						type: 'string',
						default: '',
						placeholder: 'url or base64',
						routing: { send: { type: 'body', property: 'mediaData.source' } },
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
	},

	{
		displayName: 'Set Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['buttons'],
			},
		},
		routing: {
			request: { url: '=' + shippingURL('message', 'sendButtons'), method: 'POST' },
			send: { preSend: [sendButtonsMessage] },
		},
	},
];

export const templateProperties: INodeProperties[] = [
	{
		displayName: 'Template Title',
		name: 'templateTitleProperty',
		required: true,
		default: '',
		hint: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
		routing: {
			send: { type: 'body', property: 'templateMessage.title' },
		},
	},

	{
		displayName: 'Template Description',
		name: 'templateDescProperty',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
		routing: {
			send: { type: 'body', property: 'templateMessage.description' },
		},
	},

	{
		displayName: 'Template Footer Text',
		name: 'templateFooterProperty',
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
		routing: {
			send: { type: 'body', property: 'templateMessage.footerText' },
		},
	},

	{
		displayName: 'Template Field Type',
		name: 'templateFieldTypeProperty',
		required: true,
		noDataExpression: true,
		placeholder: '',
		type: 'options',
		options: [
			{ name: 'Collection', value: 'collection' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'collection',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
	},

	{
		displayName: 'Collection Field',
		name: 'colectionProperty',
		required: true,
		placeholder: 'Add Template Buttons',
		type: 'fixedCollection',
		default: '',
		typeOptions: { multipleValues: true },
		options: [
			{
				displayName: 'Template Buttons',
				name: 'templateButtons',
				values: [
					{
						displayName: 'Button Type',
						name: 'buttonType',
						required: true,
						type: 'options',
						options: [
							{ name: 'Url Button', value: 'urlButton' },
							{ name: 'Call Button', value: 'callButton' },
							{ name: 'Reply Button', value: 'replyButton' },
						],
						default: 'replyButton',
					},
					{
						displayName: 'Display Text',
						name: 'displayText',
						required: true,
						type: 'string',
						default: '',
					},
					{
						displayName: 'Payload',
						name: 'payload',
						required: true,
						type: 'string',
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
				templateFieldTypeProperty: ['collection'],
			},
		},
		routing: { send: { type: 'body', property: 'buttons' } },
	},

	{
		displayName: 'JSON Field',
		name: 'jsonProperty',
		required: true,
		placeholder: `[Array:[{buttonType: 'replyButton', displayText: 'Button Text', payload: 'btnId01'}]]`,
		type: 'json',
		default: [],
		description: 'Map a json directly to this field',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
				templateFieldTypeProperty: ['json'],
			},
		},
		routing: { send: { type: 'body', property: 'templateMessage.buttons' } },
	},

	{
		displayName: 'Media Message',
		name: 'mediaMessageProperty',
		placeholder: 'Add Media Message',
		type: 'fixedCollection',
		default: '',
		typeOptions: { multipleValues: false },
		description: 'Embed media message to button',
		options: [
			{
				displayName: 'Media Message',
				name: 'embedMediaMessage',
				values: [
					{
						displayName: 'Media Type',
						name: 'mediaType',
						required: true,
						type: 'options',
						options: [
							{ name: 'Image', value: 'image' },
							{ name: 'Document', value: 'document' },
							{ name: 'Video', value: 'video' },
							{ name: 'Sticker', value: 'sticker' },
						],
						default: 'image',
						routing: { send: { type: 'body', property: 'mediaData.type' } },
					},
					{
						displayName: 'Media Source',
						name: 'mediaSource',
						required: true,
						type: 'string',
						default: '',
						placeholder: 'url or base64',
						routing: { send: { type: 'body', property: 'mediaData.source' } },
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
	},

	{
		displayName: 'Set Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messageType: ['template'],
			},
		},
		routing: {
			request: { url: '=' + shippingURL('message', 'sendTemplate'), method: 'POST' },
			send: { preSend: [sendTemplateMessage] },
		},
	},
];