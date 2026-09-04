import type { INodeProperties } from 'n8n-workflow';

const showOnlyForChat = {
	resource: ['chat'],
};

const showOnlyForCheckAccounts = {
	resource: ['chat'],
	operation: ['checkAccounts'],
};

const showOnlyForMarkRead = {
	resource: ['chat'],
	operation: ['markRead'],
};

const showOnlyForMarkReadByIds = {
	resource: ['chat'],
	operation: ['markRead'],
	readMessagesMode: ['databaseIds'],
};

const showOnlyForMarkReadByMessageKeys = {
	resource: ['chat'],
	operation: ['markRead'],
	readMessagesMode: ['messageKeys'],
};

const showOnlyForArchive = {
	resource: ['chat'],
	operation: ['archive'],
};

const showOnlyForDeleteMessage = {
	resource: ['chat'],
	operation: ['deleteMessage'],
};

const showOnlyForProfilePicture = {
	resource: ['chat'],
	operation: ['getProfilePicture'],
};

const showOnlyForRejectCall = {
	resource: ['chat'],
	operation: ['rejectCall'],
};

const showOnlyForEditMessage = {
	resource: ['chat'],
	operation: ['editMessage'],
};

export const chatDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForChat,
		},
		options: [
			{
				name: 'Archive',
				value: 'archive',
				action: 'Archive or unarchive a chat',
				description: 'Archive or unarchive a WhatsApp chat',
			},
			{
				name: 'Check Accounts',
				value: 'checkAccounts',
				action: 'Check whats app accounts',
				description: 'Check whether phone numbers are registered on WhatsApp',
			},
			{
				name: 'Delete Message',
				value: 'deleteMessage',
				action: 'Delete a chat message',
				description: 'Delete a message by internal ID',
			},
			{
				name: 'Edit Message',
				value: 'editMessage',
				action: 'Edit a sent message',
				description: 'Edit a previously sent WhatsApp message',
			},
			{
				name: 'Get Profile Picture',
				value: 'getProfilePicture',
				action: 'Get a profile picture',
				description: 'Get the profile picture URL for a recipient',
			},
			{
				name: 'Mark Read',
				value: 'markRead',
				action: 'Mark messages as read',
				description: 'Mark one or more messages as read',
			},
			{
				name: 'Reject Call',
				value: 'rejectCall',
				action: 'Reject a call',
				description: 'Reject an incoming WhatsApp call',
			},
		],
		default: 'checkAccounts',
	},
	{
		displayName: 'Numbers',
		name: 'numbers',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForCheckAccounts,
		},
		placeholder: '5511999999999, 5521888888888',
		description: 'Phone numbers to check, separated by commas or new lines',
	},
	{
		displayName: 'Read By',
		name: 'readMessagesMode',
		type: 'options',
		options: [
			{
				name: 'Database IDs',
				value: 'databaseIds',
			},
			{
				name: 'Message Keys',
				value: 'messageKeys',
			},
		],
		default: 'databaseIds',
		displayOptions: {
			show: showOnlyForMarkRead,
		},
		description: 'How to identify the messages to mark as read',
	},
	{
		displayName: 'Message Database IDs',
		name: 'messageDatabaseIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForMarkReadByIds,
		},
		placeholder: '123, 124',
		description: 'Internal message IDs, separated by commas or new lines',
	},
	{
		displayName: 'Sender',
		name: 'sender',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForMarkReadByMessageKeys,
		},
		description: 'Sender JID used by the read-message endpoint',
	},
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForMarkReadByMessageKeys,
		},
		description: 'Chat JID used by the read-message endpoint',
	},
	{
		displayName: 'Message IDs',
		name: 'messageIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForMarkReadByMessageKeys,
		},
		placeholder: 'BAE5..., BAE6...',
		description: 'WhatsApp message IDs, separated by commas or new lines',
	},
	{
		displayName: 'Archive',
		name: 'archive',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForArchive,
		},
		description: 'Whether to archive or unarchive the chat',
	},
	{
		displayName: 'Remote JID',
		name: 'remoteJid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForArchive,
		},
		description: 'Remote JID from the last message key',
	},
	{
		displayName: 'From Me',
		name: 'fromMe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForArchive,
		},
		description: 'Whether the last message was sent by the instance',
	},
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForArchive,
		},
		description: 'WhatsApp message ID from the last message key',
	},
	{
		displayName: 'Message Database ID',
		name: 'messageDatabaseId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForDeleteMessage,
		},
		description: 'Internal positive message ID to delete',
	},
	{
		displayName: 'Recipient Type',
		name: 'recipientType',
		type: 'options',
		options: [
			{
				name: 'Chat',
				value: 'chat',
			},
			{
				name: 'Number',
				value: 'number',
			},
			{
				name: 'Recipient',
				value: 'recipient',
			},
		],
		default: 'number',
		displayOptions: {
			show: showOnlyForProfilePicture,
		},
		description: 'Which recipient field to send to the API',
	},
	{
		displayName: 'Recipient',
		name: 'recipient',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForProfilePicture,
		},
		description: 'Phone number, chat alias, or recipient alias',
	},
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForRejectCall,
		},
		description: 'ID of the call to reject',
	},
	{
		displayName: 'Call From',
		name: 'callFrom',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForRejectCall,
		},
		placeholder: '5511999999999@s.whatsapp.net',
		description: 'JID that originated the call',
	},
	{
		displayName: 'Message ID',
		name: 'editMessageId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForEditMessage,
		},
		description: 'Internal or WhatsApp message ID to edit',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		default: '',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForEditMessage,
		},
		description: 'New message text',
	},
];
