import type { INodeProperties } from 'n8n-workflow';

const showOnlyForWebhook = {
	resource: ['webhook'],
};

const showOnlyForSet = {
	resource: ['webhook'],
	operation: ['set'],
};

const webhookEventOptions: INodeProperties[] = [
	{ displayName: 'Call Upsert', name: 'callUpsert', type: 'boolean', default: true },
	{ displayName: 'Chats Deleted', name: 'chatsDeleted', type: 'boolean', default: true },
	{ displayName: 'Chats Updated', name: 'chatsUpdated', type: 'boolean', default: true },
	{ displayName: 'Connection Updated', name: 'connectionUpdated', type: 'boolean', default: true },
	{ displayName: 'Contacts Updated', name: 'contactsUpdated', type: 'boolean', default: true },
	{ displayName: 'Contacts Upsert', name: 'contactsUpsert', type: 'boolean', default: true },
	{
		displayName: 'Groups Participants Updated',
		name: 'groupsParticipantsUpdated',
		type: 'boolean',
		default: true,
	},
	{ displayName: 'Groups Updated', name: 'groupsUpdated', type: 'boolean', default: true },
	{ displayName: 'Groups Upsert', name: 'groupsUpsert', type: 'boolean', default: true },
	{ displayName: 'History Sync', name: 'historySync', type: 'boolean', default: true },
	{ displayName: 'Identity Updated', name: 'identityUpdated', type: 'boolean', default: true },
	{ displayName: 'Labels Association', name: 'labelsAssociation', type: 'boolean', default: true },
	{ displayName: 'Labels Edit', name: 'labelsEdit', type: 'boolean', default: true },
	{ displayName: 'Media Retry', name: 'mediaRetry', type: 'boolean', default: true },
	{ displayName: 'Messages Deleted', name: 'messagesDeleted', type: 'boolean', default: true },
	{ displayName: 'Messages Starred', name: 'messagesStarred', type: 'boolean', default: true },
	{
		displayName: 'Messages Undecryptable',
		name: 'messagesUndecryptable',
		type: 'boolean',
		default: true,
	},
	{ displayName: 'Messages Updated', name: 'messagesUpdated', type: 'boolean', default: true },
	{ displayName: 'Messages Upsert', name: 'messagesUpsert', type: 'boolean', default: true },
	{ displayName: 'Newsletter', name: 'newsLetter', type: 'boolean', default: true },
	{ displayName: 'Presence Updated', name: 'presenceUpdated', type: 'boolean', default: true },
	{
		displayName: 'Profile Picture Updated',
		name: 'profilePictureUpdated',
		type: 'boolean',
		default: true,
	},
	{ displayName: 'QR Code Updated', name: 'qrcodeUpdated', type: 'boolean', default: true },
	{ displayName: 'Send Message', name: 'sendMessage', type: 'boolean', default: true },
	{ displayName: 'Settings Updated', name: 'settingsUpdated', type: 'boolean', default: true },
	{ displayName: 'Status Instance', name: 'statusInstance', type: 'boolean', default: true },
	{ displayName: 'User About Updated', name: 'userAboutUpdated', type: 'boolean', default: true },
];

export const webhookDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForWebhook,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get instance webhook',
				description: 'Get the webhook configuration for the instance',
			},
			{
				name: 'Set',
				value: 'set',
				action: 'Set instance webhook',
				description: 'Set the webhook configuration for the instance',
			},
		],
		default: 'get',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSet,
		},
		placeholder: 'https://example.com/webhooks/codechat',
		description: 'Webhook URL that will receive CodeChat events',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForSet,
		},
		description: 'Whether the webhook should be enabled',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'collection',
		placeholder: 'Add Event',
		default: {},
		displayOptions: {
			show: showOnlyForSet,
		},
		options: webhookEventOptions,
		description: 'Events to configure for the webhook',
	},
];
