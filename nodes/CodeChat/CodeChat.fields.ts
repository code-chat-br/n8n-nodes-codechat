import { INodeProperties } from 'n8n-workflow';
import { optionsMessage, textProperty } from './descriptions/SendMessage.desc';
import { formatNumber } from './Generic.func';

const messageResource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		noDataExpression: true,
		placeholder: '',
		type: 'options',
		options: [
			{ name: 'Send Message', value: 'sendMessage', action: 'sendMessage' },
			{ name: 'Fetch Queue', value: 'queue', action: 'fetchQueue' },
		],
		default: 'sendMessage',
		displayOptions: { show: { resource: ['message'] } },
	},

	{
		displayName: 'List recipient phone numbers',
		name: 'listPhoneNumbers',
		type: 'json',
		default: [],
		placeholder: `[Array:['5531900000000, '5521911111111']]`,
		description: 'Phone numbers of message recipients',
		hint: 'When entering a phone number, make sure to include the country code',
		routing: { send: { preSend: [formatNumber] } },
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
	},

	/**┌──────────────────────────┐
	 * │		 Options Message			│
	 * └──────────────────────────┘
	 */
	...optionsMessage,

	{
		displayName: 'Message Type',
		name: 'messageType',
		noDataExpression: true,
		type: 'options',
		placeholder: '',
		options: [
			{ name: 'Text', value: 'text', action: 'sendText' },
			{ name: 'Buttons', value: 'buttons', action: 'sendButtons' },
			{ name: 'Template', value: 'template', action: 'sendTemplate' },
			{ name: 'Media', value: 'media', action: 'sendMedia' },
			{ name: 'Media Base64', value: 'mediaBase64', action: 'sendMediaBase64' },
			{ name: 'WhatsApp Audio', value: 'whatsAppAudio', action: 'sendWhatsAppAudio' },
			{ name: 'Location', value: 'location', action: 'sendLocation' },
			{ name: 'List', value: 'list', action: 'sendList' },
			{ name: 'Link Preview', value: 'linkPreview', action: 'sendLinkPreview' },
			{ name: 'Contact', value: 'contact', action: 'sendContact' },
		],
		default: 'text',
		routing: { request: { ignoreHttpStatusErrors: true } },
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendMessage'],
			},
		},
	},

	/**┌──────────────────────────┐
	 * │		   Type Message 			│
	 * └──────────────────────────┘
	 */
	...textProperty,
];

export const codechatFields: INodeProperties[] = [
	/**┌──────────────────────────┐
	 * │		Resource: Message			│
	 * └──────────────────────────┘
	 */
	...messageResource,
];
