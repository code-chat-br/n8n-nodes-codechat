import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

export const mediaTypeOptions = [
	{
		name: 'Audio',
		value: 'audio',
	},
	{
		name: 'Document',
		value: 'document',
	},
	{
		name: 'Image',
		value: 'image',
	},
	{
		name: 'Video',
		value: 'video',
	},
];

const showOnlyForSendMedia = {
	resource: ['message'],
	operation: ['sendMedia'],
};

export const sendMediaDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendMedia,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: mediaTypeOptions,
		default: 'image',
		required: true,
		displayOptions: {
			show: showOnlyForSendMedia,
		},
		description: 'Type of media to send',
	},
	{
		displayName: 'Media Source',
		name: 'mediaSource',
		type: 'options',
		options: [
			{
				name: 'Media Upload ID',
				value: 'uploadId',
			},
			{
				name: 'URL',
				value: 'url',
			},
		],
		default: 'url',
		required: true,
		displayOptions: {
			show: showOnlyForSendMedia,
		},
		description: 'Where to load the media from',
	},
	{
		displayName: 'Media URL',
		name: 'media',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendMedia,
				mediaSource: ['url'],
			},
		},
		description: 'URL of the media file to send',
	},
	{
		displayName: 'Media Upload ID',
		name: 'uploadedMediaId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendMedia,
				mediaSource: ['uploadId'],
			},
		},
		description: 'ID returned by the media upload operation',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendMedia,
		},
		description: 'File name to display for document/media messages',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendMedia,
		},
		description: 'Caption to send with the media',
	},
	createMessageOptions({ show: showOnlyForSendMedia }),
];
