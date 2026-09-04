import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendReaction = {
	resource: ['message'],
	operation: ['sendReaction'],
};

export const sendReactionDescription: INodeProperties[] = [
	{
		displayName: 'Remote JID',
		name: 'remoteJid',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendReaction,
		},
		description: 'Remote JID of the message to react to',
	},
	{
		displayName: 'From Me',
		name: 'fromMe',
		type: 'boolean',
		default: false,
		required: true,
		displayOptions: {
			show: showOnlyForSendReaction,
		},
		description: 'Whether the message was sent by the instance',
	},
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendReaction,
		},
		description: 'ID of the message to react to',
	},
	{
		displayName: 'Reaction',
		name: 'reaction',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendReaction,
		},
		description: 'Single-character reaction to send',
	},
];
