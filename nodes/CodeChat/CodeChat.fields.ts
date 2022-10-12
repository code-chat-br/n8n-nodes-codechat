import { INodeProperties } from 'n8n-workflow';
import {
	buttonsProperties,
	contactProperties,
	linkPreviewProperties,
	listProperties,
	locationProperties,
	mediaBase64MessgeProperties,
	mediaMessageProperties,
	optionsProperties,
	templateProperties,
	textProperties,
	whatsAppAudioProperties,
} from './descriptions/SendMessage.desc';
import { formatNumber } from './Generic.func';

const messageResource: INodeProperties[] = [
	{
		displayName: 'List recipient phone numbers',
		name: 'listPhoneNumbers',
		type: 'json',
		default: [],
		placeholder: `[Array:['5531900000000, '5521911111111']]`,
		description: 'Phone numbers of message recipients',
		hint: 'When entering a phone number, make sure to include the country code',
		routing: { send: { preSend: [formatNumber] } },
		displayOptions: { show: { resource: ['sendMessage'] } },
	},

	/**┌──────────────────────────────┐
	 * │      Options Properties      │
	 * └──────────────────────────────┘
	 */
	...optionsProperties,

	{
		displayName: 'Operation',
		name: 'operation',
		noDataExpression: true,
		placeholder: '',
		required: true,
		type: 'options',
		options: [
			{ name: 'Send Text', value: 'sendText' },
			{ name: 'Send Buttons', value: 'sendButtons' },
			{ name: 'Send Template', value: 'sendTemplate' },
			{ name: 'Send Media', value: 'sendMedia' },
			{ name: 'Send Media Base64', value: 'sendMediaBase64' },
			{ name: 'Send WhatsApp Audio', value: 'sendWhatsAppAudio' },
			{ name: 'Send Location', value: 'sendLocation' },
			{ name: 'Send List', value: 'sendList' },
			{ name: 'Send Link Preview', value: 'sendLinkPreview' },
			{ name: 'Send Contact', value: 'sendContact' },
		],
		default: 'sendText',
		routing: { request: { ignoreHttpStatusErrors: true } },
		displayOptions: { show: { resource: ['sendMessage'] } },
	},

	/**┌───────────────────────────┐
	 * │      Text Properties      │
	 * └───────────────────────────┘
	 */
	...textProperties,

	/**┌──────────────────────────────┐
	 * │      Buttons Properties      │
	 * └──────────────────────────────┘
	 */
	...buttonsProperties,

	/**┌───────────────────────────────┐
	 * │      Template Properties      │
	 * └───────────────────────────────┘
	 */
	...templateProperties,

	/**┌────────────────────────────┐
	 * │      Media Properties      │
	 * └────────────────────────────┘
	 */
	...mediaMessageProperties,

	/**┌───────────────────────────────────┐
	 * │      Media Base64 Properties      │
	 * └───────────────────────────────────┘
	 */
	...mediaBase64MessgeProperties,

	/**┌───────────────────────────────┐
	 * │      WhatsApp Properties      │
	 * └───────────────────────────────┘
	 */
	...whatsAppAudioProperties,

	/**┌───────────────────────────────┐
	 * │      Location Properties      │
	 * └───────────────────────────────┘
	 */
	...locationProperties,

	/**┌───────────────────────────┐
	 * │      List Properties      │
	 * └───────────────────────────┘
	 */
	...listProperties,

	/**┌───────────────────────────────────┐
	 * │      Link Preview Properties      │
	 * └───────────────────────────────────┘
	 */
	...linkPreviewProperties,

	/**┌───────────────────────────────┐
	 * │       Contact Properties      │
	 * └───────────────────────────────┘
	 */
	...contactProperties,
];

export const codechatFields: INodeProperties[] = [
	/**┌──────────────────────────┐
	 * │		Resource: Message			│
	 * └──────────────────────────┘
	 */
	...messageResource,
];
