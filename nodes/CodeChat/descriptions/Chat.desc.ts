import { INodeProperties } from 'n8n-workflow';
import { formatNumber, readMessage, shippingURL } from '../Generic.func';

export const onWhatsappProperties: INodeProperties[] = [
	{
		displayName: 'List recipient phone numbers',
		name: 'listPhoneNumbers',
		type: 'json',
		default: [],
		placeholder: `[Array:['5531900000000, '5521911111111']] or 5531922222222`,
		description: 'This field supports both a list and a single number.',
		hint: 'Check if the contact is a whatsapp contact. When entering a phone number, make sure to include the country code',
		routing: {
			send: { type: 'body', property: 'numbers', preSend: [formatNumber] },
			request: { url: '=' + shippingURL('chat', 'onWhatsApp'), method: 'POST' },
		},
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['onWhatsApp'],
			},
		},
	},
];

export const updatePresence: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: { send: { type: 'query', property: 'number' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updatePresence'],
			},
		},
	},

	{
		displayName: 'Precense Type',
		name: 'presenceTypeProperty',
		required: true,
		description: 'Simulate your presence in the chat',
		type: 'options',
		options: [
			{ name: 'Composing', value: 'composing' },
			{ name: 'Unavailable', value: 'unavailable' },
			{ name: 'Available', value: 'available' },
			{ name: 'Recording', value: 'recording' },
			{ name: 'Paused', value: 'paused' },
		],
		default: 'composing ',
		routing: { send: { type: 'body', property: 'presence' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updatePresence'],
			},
		},
	},

	{
		displayName: 'Delay',
		name: 'delayProperty',
		required: true,
		type: 'number',
		default: 1200,
		routing: { send: { type: 'body', property: 'delay' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updatePresence'],
			},
		},
	},

	{
		displayName: 'Set Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		routing: { request: { url: '=' + shippingURL('chat', 'updatePresence'), method: 'PUT' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updatePresence'],
			},
		},
	},
];

export const markMSGReadProperties: INodeProperties[] = [
	{
		displayName: 'Mark Message as Read',
		name: 'readMessagesProperty',
		required: true,
		type: 'json',
		default: [],
		placeholder: `[Array:[messageId:'id',wuid:'123@s.whatsapp.net',fromMe:false]]`,
		routing: {
			send: { type: 'body', property: 'readMessage', preSend: [readMessage] },
			request: { url: '=' + shippingURL('chat', 'markMessageAsRead'), method: 'PUT' },
		},
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['markMessageAsRead'],
			},
		},
	},
];

export const blockCobtactProperties: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: { send: { type: 'query', property: 'number' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['blockContact'],
			},
		},
	},

	{
		displayName: 'Action',
		name: 'actionProperty',
		required: true,
		type: 'options',
		options: [
			{ name: 'Block', value: 'block' },
			{ name: 'Unblock', value: 'unblock' },
		],
		default: 'block ',
		routing: { send: { type: 'body', property: 'action' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['blockContact'],
			},
		},
	},

	{
		displayName: 'Set Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		routing: { request: { url: '=' + shippingURL('chat', 'blockContact'), method: 'PUT' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['blockContact'],
			},
		},
	},
];

export const statusContactPorperties: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: {
			send: { type: 'query', property: 'number' },
			request: { url: '=' + shippingURL('chat', 'fetchStatusContact'), method: 'GET' },
		},
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['contactStatus'],
			},
		},
	},
];

export const updateStatusProperties: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: { send: { type: 'query', property: 'number' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updateStatus'],
			},
		},
	},

	{
		displayName: 'Status',
		name: 'StatusProperty',
		required: true,
		type: 'string',
		default: '',
		routing: { send: { type: 'body', property: 'status' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updateStatus'],
			},
		},
	},

	{
		displayName: 'Set Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		routing: { request: { url: '=' + shippingURL('chat', 'updateStaus'), method: 'PUT' } },
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['updateStatus'],
			},
		},
	},
];

export const budinessProfileProperties: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: {
			send: { type: 'query', property: 'number' },
			request: { url: '=' + shippingURL('chat', 'fetchBusinessProfile'), method: 'GET' },
		},
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['businesProfile'],
			},
		},
	},
];

export const profilePictureProperties: INodeProperties[] = [
	{
		displayName: 'Recipient phone numbers',
		name: 'numberProperty',
		required: true,
		type: 'string',
		default: '',
		routing: {
			send: { type: 'query', property: 'number' },
			request: { url: '=' + shippingURL('chat', 'fetchProfilePictureUrl'), method: 'GET' },
		},
		displayOptions: {
			show: {
				resource: ['chat'],
				operation: ['profilePictureUrl'],
			},
		},
	},
];
