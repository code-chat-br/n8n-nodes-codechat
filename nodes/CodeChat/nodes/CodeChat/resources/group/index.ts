import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGroup = {
	resource: ['group'],
};

const showOnlyForCreate = {
	resource: ['group'],
	operation: ['create'],
};

const showOnlyForGroupJid = {
	resource: ['group'],
	operation: ['getInviteCode', 'leave', 'revokeInviteCode', 'updateParticipants'],
};

const showOnlyForUpdatePicture = {
	resource: ['group'],
	operation: ['updatePicture'],
};

const showOnlyForUpdateParticipants = {
	resource: ['group'],
	operation: ['updateParticipants'],
};

export const groupDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForGroup,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a group',
				description: 'Create a WhatsApp group',
			},
			{
				name: 'Get Invite Code',
				value: 'getInviteCode',
				action: 'Get a group invite code',
				description: 'Get the invitation code for a group',
			},
			{
				name: 'Leave',
				value: 'leave',
				action: 'Leave a group',
				description: 'Leave a WhatsApp group',
			},
			{
				name: 'Revoke Invite Code',
				value: 'revokeInviteCode',
				action: 'Revoke a group invite code',
				description: 'Revoke the invitation code for a group',
			},
			{
				name: 'Update Participants',
				value: 'updateParticipants',
				action: 'Update group participants',
				description: 'Add, remove, promote, or demote group participants',
			},
			{
				name: 'Update Picture',
				value: 'updatePicture',
				action: 'Update a group picture',
				description: 'Update the profile picture of a WhatsApp group',
			},
		],
		default: 'create',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		description: 'Subject or name of the group',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForCreate,
		},
		description: 'Optional group description',
	},
	{
		displayName: 'Participants',
		name: 'participants',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForCreate,
		},
		placeholder: '5511999999999, 5521888888888',
		description: 'Participants to add, separated by commas or new lines',
	},
	{
		displayName: 'Group JID',
		name: 'groupJid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForGroupJid,
		},
		placeholder: '120363000000000000@g.us',
		description: 'WhatsApp group JID',
	},
	{
		displayName: 'Group JID',
		name: 'groupJid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUpdatePicture,
		},
		placeholder: '120363000000000000@g.us',
		description: 'WhatsApp group JID',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUpdatePicture,
		},
		placeholder: 'https://example.com/group-picture.jpg',
		description: 'Public HTTP(S) URL of the new group picture',
	},
	{
		displayName: 'Action',
		name: 'participantAction',
		type: 'options',
		options: [
			{
				name: 'Add',
				value: 'add',
			},
			{
				name: 'Demote',
				value: 'demote',
			},
			{
				name: 'Promote',
				value: 'promote',
			},
			{
				name: 'Remove',
				value: 'remove',
			},
		],
		default: 'add',
		displayOptions: {
			show: showOnlyForUpdateParticipants,
		},
		description: 'Participant update action',
	},
	{
		displayName: 'Participants',
		name: 'participants',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForUpdateParticipants,
		},
		placeholder: '5511999999999, 5521888888888',
		description: 'Participants to update, separated by commas or new lines',
	},
];
