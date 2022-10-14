import { INodeProperties } from 'n8n-workflow';
import { createGroup, shippingURL, updateGroupIngo } from '../Generic.func';

export const createGroupPrperties: INodeProperties[] = [
	{
		displayName: 'Subject',
		name: 'subjectProperties',
		required: true,
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		routing: { send: { type: 'body', property: 'groupSubject' } },
	},

	{
		displayName: 'Participants List',
		name: 'participantsList',
		type: 'json',
		default: [],
		placeholder: `[Array:['5531900000000, '5521911111111']] or 5531922222222`,
		description: 'This field supports both a list and a single number.',
		hint: 'When entering a phone number, make sure to include the country code',
		routing: { send: { type: 'body', property: 'participants' } },
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
	},

	{
		displayName: 'Description Group',
		name: 'descriptionProperty',
		placeholder: 'Add Description',
		type: 'fixedCollection',
		default: '',
		options: [
			{
				displayName: 'Description',
				name: 'groupDescription',
				values: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
	},

	{
		displayName: 'Group Profile Picture',
		name: 'profilePictureProperty',
		placeholder: 'Add Picture',
		type: 'fixedCollection',
		default: '',
		options: [
			{
				displayName: 'Profile Picture',
				name: 'profilePictureGroup',
				values: [
					{
						displayName: 'Profile Picture',
						name: 'profilePicture',
						type: 'string',
						default: '',
						placeholder: 'url or base64',
					},
				],
			},
		],
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['createGroup'],
			},
		},
		routing: {
			send: { preSend: [createGroup] },
			request: {
				url: '=' + shippingURL('group', 'createGroup'),
				method: 'POST',
			},
		},
	},
];

export const groupInviteCodeProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Retrieve the group invite you created.',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['inviteCode'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
			request: {
				url: '=' + shippingURL('group', 'invitionCode'),
				method: 'GET',
			},
		},
	},
];

export const acceptInviteCodeProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group ID you want to accept the invitation',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['acceptInvite'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
			request: {
				url: '=' + shippingURL('group', 'acceptInviteCode'),
				method: 'GET',
			},
		},
	},
];

export const revokeInviteCodeProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group ID you want to revoke the invitation',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['revokeInvite'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
			request: {
				url: '=' + shippingURL('group', 'revokeInviteCode'),
				method: 'GET',
			},
		},
	},
];

export const updateGroupProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group ID you want to update',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateInfo'],
			},
		},
		routing: { send: { type: 'query', property: 'groupJid' } },
	},

	{
		displayName: 'Subject',
		name: 'subjectProperty',
		type: 'string',
		default: '',
		description: 'Update group subject',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateInfo'],
			},
		},
		routing: { send: { type: 'body', property: 'groupSubject' } },
	},

	{
		displayName: 'Description',
		name: 'descriptionProperty',
		type: 'string',
		default: '',
		description: 'Update group description',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateInfo'],
			},
		},
		routing: { send: { type: 'body', property: 'groupDescription' } },
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateInfo'],
			},
		},
		routing: {
			send: { preSend: [updateGroupIngo] },
			request: {
				url: '=' + shippingURL('group', 'updateInfo'),
				method: 'PUT',
			},
		},
	},
];

export const updatePropfilePictureProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group ID you want to update',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updatePicture'],
			},
		},
		routing: { send: { type: 'query', property: 'groupJid' } },
	},

	{
		displayName: 'Profile Picture',
		name: 'profilePictureProperty',
		required: true,
		placeholder: 'url or base64',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updatePicture'],
			},
		},
		routing: { send: { type: 'body', property: 'urlOrBse64' } },
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updatePicture'],
			},
		},
		routing: {
			request: {
				url: '=' + shippingURL('group', 'updateProfilePicture'),
				method: 'PUT',
			},
		},
	},
];

export const groupMetadataProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Retrieve group information',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['groupMetadata'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
			request: {
				url: '=' + shippingURL('group', 'fetchInfo'),
				method: 'GET',
			},
		},
	},
];

export const updateParticipantsPorperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group Id created by the number logged in',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateParticipants'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
		},
	},

	{
		displayName: 'Action',
		name: 'actionProperty',
		required: true,
		type: 'options',
		options: [
			{ name: 'Add', value: 'add' },
			{ name: 'Remove', value: 'remove' },
			{ name: 'Promote Admin', value: 'promote' },
			{ name: 'Demote', value: 'demote' },
		],
		default: 'add',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateParticipants'],
			},
		},
		routing: { send: { type: 'body', property: 'action' } },
	},

	{
		displayName: 'Participants',
		name: 'participantsList',
		type: 'json',
		default: [],
		placeholder: `[Array:['5531900000000, '5521911111111']] or 5531922222222`,
		description: 'This field supports both a list and a single number.',
		hint: 'When entering a phone number, make sure to include the country code',
		routing: { send: { type: 'body', property: 'participants' } },
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateParticipants'],
			},
		},
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateParticipants'],
			},
		},
		routing: {
			request: {
				url: '=' + shippingURL('group', 'updateParticipants'),
				method: 'PUT',
			},
		},
	},
];

export const updateSettingsGroupProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Apply rules to the group',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateParticipants'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
		},
	},

	{
		displayName: 'Rules',
		name: 'ruleProperty',
		required: true,
		type: 'options',
		options: [
			{ name: 'Comments: Admins', value: 'announcement' },
			{ name: 'Comments: All', value: 'not_announcement' },
			{ name: 'Edit Group: Admins', value: 'locked' },
			{ name: 'Edit Group: All', value: 'unLocked' },
		],
		default: 'announcement',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateSettings'],
			},
		},
		routing: {
			send: { type: 'body', property: 'settings' },
		},
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['updateSettings'],
			},
		},
		routing: {
			request: {
				url: '=' + shippingURL('group', 'updateSettings'),
				method: 'PUT',
			},
		},
	},
];

export const changeExpirationProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Duration of group messages',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['changeExpiration'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
		},
	},

	{
		displayName: 'Rules',
		name: 'ruleProperty',
		required: true,
		type: 'options',
		options: [
			{ name: 'No expiration', value: 0 },
			{ name: 'One day', value: 1 },
			{ name: 'One week', value: 7 },
			{ name: 'Quarterly', value: 90 },
		],
		default: 'announcement',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['changeExpiration'],
			},
		},
		routing: {
			send: { type: 'body', property: 'settings' },
		},
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['changeExpiration'],
			},
		},
		routing: {
			request: {
				url: '=' + shippingURL('group', 'changeExpiration'),
				method: 'PUT',
			},
		},
	},
];

export const fetchParticipantsProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Search for members of a group you belong to',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['fetchParticpants'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
		},
	},

	{
		displayName: 'Member type',
		name: 'memberTypeProperty',
		required: true,
		type: 'options',
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Common', value: 'common' },
			{ name: 'Admin', value: 'admin' },
			{ name: 'Super admin', value: 'superadmin' },
		],
		default: 'announcement',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['fetchParticpants'],
			},
		},
		routing: {
			send: { type: 'query', property: 'memberType' },
		},
	},

	{
		displayName: 'Sert Routing',
		name: 'setRouting',
		type: 'hidden',
		default: '',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['fetchParticpants'],
			},
		},
		routing: {
			request: {
				url: '=' + shippingURL('group', 'fetchParticpants'),
				method: 'PUT',
			},
		},
	},
];

export const leaveGroupProperties: INodeProperties[] = [
	{
		displayName: 'Group ID',
		name: 'groupIdProperty',
		required: true,
		placeholder: '123456789-123345@g.us',
		type: 'string',
		default: '',
		description: 'Group ID you want to leave',
		displayOptions: {
			show: {
				resource: ['group'],
				operation: ['leaveGroup'],
			},
		},
		routing: {
			send: { type: 'query', property: 'groupJid' },
			request: {
				url: '=' + shippingURL('group', 'leave'),
				method: 'DELETE',
			},
		},
	},
];
