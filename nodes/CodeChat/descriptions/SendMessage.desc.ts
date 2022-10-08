import { INodeProperties } from 'n8n-workflow';
import { sendTextMessage, shippingURL } from '../Generic.func';

export const optionsMessage: INodeProperties[] = [
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
		routing: { send: { type: 'body', property: 'options.delay' } },
	},
];

export const textProperty: INodeProperties[] = [
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
				messagetype: ['text'],
			},
		},
		routing: {
			send: { type: 'body', property: 'text', preSend: [sendTextMessage] },
			request: {
				url: '=' + shippingURL('message', 'sendText'),
			},
		},
	},
];

export const buttonsProperty: INodeProperties[] = [
	{
		displayName: 'Button Title',
		name: 'buttonTitleProperty',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messagetype: ['buttons'],
			},
		},
		routing: {
			send: { type: 'body', property: 'buttonsMessage.title' },
			request: {
				url: '=' + shippingURL('message', 'sendButtons'),
			},
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
				messagetype: ['buttons'],
			},
		},
		routing: {
			send: { type: 'body', property: 'buttonsMessage.description' },
		},
	},

	{
		displayName: 'Button Footer Text',
		name: 'buttonFooterProperty',
		required: true,
		default: '',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messagetype: ['buttons'],
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
				messagetype: ['buttons'],
			},
		},
	},

	{
		displayName: 'Collection',
		name: 'collectionProperty',
		required: true,
		placeholder: 'Add Reply Buttons',
		type: 'fixedCollection',
		default: '',
		typeOptions: { multipleValues: true, maxValue: 3, minValue: 1 },
		description: '',
		options: [
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
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
				messagetype: ['buttons'],
				buttonFieldTypeProperty: ['collection'],
			},
		},
		routing: { send: { type: 'body', property: 'buttons' } },
	},

	{
		displayName: 'JSON',
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
				messagetype: ['buttons'],
				buttonFieldTypeProperty: ['collection'],
			},
		},
		routing: { send: { type: 'body', property: 'buttonsMessage.buttons' } },
	},
];
