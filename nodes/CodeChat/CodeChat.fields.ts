import { INodeProperties } from 'n8n-workflow';
import {
	blockCobtactProperties,
	budinessProfileProperties,
	markMSGReadProperties,
	onWhatsappProperties,
	profilePictureProperties,
	statusContactPorperties,
	updatePresence,
	updateStatusProperties,
} from './descriptions/Chat.desc';
import {
	acceptInviteCodeProperties,
	changeExpirationProperties,
	createGroupPrperties,
	fetchParticipantsProperties,
	groupInviteCodeProperties,
	groupMetadataProperties,
	leaveGroupProperties,
	revokeInviteCodeProperties,
	updateGroupProperties,
	updateParticipantsPorperties,
	updatePropfilePictureProperties,
	updateSettingsGroupProperties,
} from './descriptions/Group.desc';
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
		placeholder: `[Array:['5531900000000, '5521911111111']] or 5531922222222`,
		description: 'This field supports both a list and a single number.',
		hint: 'When entering a phone number, make sure to include the country code',
		routing: { send: { type: 'body', property: 'numbers', preSend: [formatNumber] } },
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

const chatResource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		noDataExpression: true,
		placeholder: '',
		required: true,
		type: 'options',
		options: [
			{ name: 'On WhatsApp', value: 'onWhatsApp' },
			{ name: 'Update Presence', value: 'updatePresence' },
			{ name: 'Mark Message As Read', value: 'markMessageAsRead' },
			{ name: 'Block Contact', value: 'blockContact' },
			{ name: 'Contact Status', value: 'contactStatus' },
			{ name: 'Update Status', value: 'updateStatus' },
			{ name: 'Business Profile', value: 'businesProfile' },
			{ name: 'Profile Picture Url', value: 'profilePictureUrl' },
		],
		default: 'onWhatsApp',
		routing: { request: { ignoreHttpStatusErrors: true } },
		displayOptions: { show: { resource: ['chat'] } },
	},

	/**┌───────────────────────────────────┐
	 * │      On WhatsApp Properties       │
	 * └───────────────────────────────────┘
	 */
	...onWhatsappProperties,

	/**┌───────────────────────────────────────┐
	 * │      Update Presence Properties       │
	 * └───────────────────────────────────────┘
	 */
	...updatePresence,

	/**┌───────────────────────────────────┐
	 * │      Read Message Properties      │
	 * └───────────────────────────────────┘
	 */
	...markMSGReadProperties,

	/**┌────────────────────────────────────┐
	 * │      Block Contact Properties      │
	 * └────────────────────────────────────┘
	 */
	...blockCobtactProperties,

	/**┌─────────────────────────────────────┐
	 * │      Status Contact Properties      │
	 * └─────────────────────────────────────┘
	 */
	...statusContactPorperties,

	/**┌────────────────────────────────────┐
	 * │      Update Status Properties      │
	 * └────────────────────────────────────┘
	 */
	...updateStatusProperties,

	/**┌───────────────────────────────────────┐
	 * │      Business Profile Properties      │
	 * └───────────────────────────────────────┘
	 */
	...budinessProfileProperties,

	/**┌──────────────────────────────────────┐
	 * │      Profile Picture Properties      │
	 * └──────────────────────────────────────┘
	 */
	...profilePictureProperties,
];

const groupResource: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		required: true,
		noDataExpression: true,
		type: 'options',
		options: [
			{ name: 'Create Group', value: 'createGroup' },
			{ name: 'Invite Code', value: 'inviteCode' },
			{ name: 'Revoke Invite', value: 'revokeInvite' },
			{ name: 'Accept Invite', value: 'acceptInvite' },
			{ name: 'Update Info', value: 'updateInfo' },
			{ name: 'Update Profile Picture', value: 'updatePicture' },
			{ name: 'Group Metadata', value: 'groupMetadata' },
			{ name: 'Update Participants', value: 'updateParticipants' },
			{ name: 'Update Settings', value: 'updateSettings' },
			{ name: 'Change Expiration', value: 'changeExpiration' },
			{ name: 'Fetch Participants', value: 'fetchParticpants' },
			{ name: 'Leave the group', value: 'leaveGroup' },
		],
		default: 'createGroup',
		displayOptions: {
			show: { resource: ['group'] },
		},
	},

	/**┌───────────────────────────────────┐
	 * │      Create Group Properties      │
	 * └───────────────────────────────────┘
	 */
	...createGroupPrperties,

	/**┌──────────────────────────────────┐
	 * │      Invite Code Properties      │
	 * └──────────────────────────────────┘
	 */
	...groupInviteCodeProperties,

	/**┌────────────────────────────────────┐
	 * │      Accept Invite Properties      │
	 * └────────────────────────────────────┘
	 */
	...acceptInviteCodeProperties,

	/**┌────────────────────────────────────┐
	 * │      Revoke Invite Properties      │
	 * └────────────────────────────────────┘
	 */
	...revokeInviteCodeProperties,

	/**┌───────────────────────────────────┐
	 * │      Update Group Properties      │
	 * └───────────────────────────────────┘
	 */
	...updateGroupProperties,

	/**┌─────────────────────────────────────────────┐
	 * │      Update Profile Picture Properties      │
	 * └─────────────────────────────────────────────┘
	 */
	...updatePropfilePictureProperties,

	/**┌─────────────────────────────────────┐
	 * │      Group Metadata Properties      │
	 * └─────────────────────────────────────┘
	 */
	...groupMetadataProperties,

	/**┌──────────────────────────────────────────┐
	 * │      Update Participants Properties      │
	 * └──────────────────────────────────────────┘
	 */
	...updateParticipantsPorperties,

	/**┌──────────────────────────────────────┐
	 * │      Update Settings Properties      │
	 * └──────────────────────────────────────┘
	 */
	...updateSettingsGroupProperties,

	/**┌────────────────────────────────────────┐
	 * │      Change Expiration Properties      │
	 * └────────────────────────────────────────┘
	 */
	...changeExpirationProperties,

	/**┌────────────────────────────────────────────┐
	 * │      Retrieve Participants Properties      │
	 * └────────────────────────────────────────────┘
	 */
	...fetchParticipantsProperties,

	/**┌──────────────────────────────────┐
	 * │      Leave Group Properties      │
	 * └──────────────────────────────────┘
	 */
	...leaveGroupProperties,
];

export const codechatFields: INodeProperties[] = [
	/**┌─────────────────────────────┐
	 * │      Resource: Message      │
	 * └─────────────────────────────┘
	 */
	...messageResource,

	/**┌──────────────────────────┐
	 * │      Resource: Caht      │
	 * └──────────────────────────┘
	 */
	...chatResource,

	/**┌───────────────────────────┐
	 * │      Resource: Group      │
	 * └───────────────────────────┘
	 */
	...groupResource,
];
