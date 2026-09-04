import type { INodeProperties } from 'n8n-workflow';

import { mediaTypeOptions } from '../message/sendMedia';

const showOnlyForMedia = {
	resource: ['media'],
};

const showOnlyForUpload = {
	resource: ['media'],
	operation: ['upload'],
};

const showOnlyForGet = {
	resource: ['media'],
	operation: ['get'],
};

const showOnlyForDelete = {
	resource: ['media'],
	operation: ['delete'],
};

const showOnlyForDownload = {
	resource: ['media'],
	operation: ['download'],
};

const showOnlyForGetAll = {
	resource: ['media'],
	operation: ['getAll'],
};

const showOnlyForDownloadById = {
	resource: ['media'],
	operation: ['download'],
	downloadMode: ['id'],
};

const showOnlyForDownloadByKeyId = {
	resource: ['media'],
	operation: ['download'],
	downloadMode: ['keyId'],
};

const showOnlyForDownloadByContent = {
	resource: ['media'],
	operation: ['download'],
	downloadMode: ['content'],
};

export const mediaDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMedia,
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an uploaded media',
				description: 'Delete an uploaded media by ID',
			},
			{
				name: 'Download',
				value: 'download',
				action: 'Download message media',
				description: 'Download encrypted WhatsApp message media as binary data',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an uploaded media',
				description: 'Get an uploaded media by ID',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many uploaded media',
				description: 'Get many uploaded media',
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload media',
				description: 'Upload media for later use in messages',
			},
		],
		default: 'upload',
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForUpload,
		},
		description: 'Name of the input binary field containing the file to upload',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: mediaTypeOptions,
		default: 'image',
		required: true,
		displayOptions: {
			show: showOnlyForUpload,
		},
		description: 'Type of media to upload',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForUpload,
		},
		description: 'Optional external ID to associate with the uploaded media',
	},
	{
		displayName: 'External Attributes',
		name: 'externalAttributes',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlyForUpload,
		},
		description: 'Optional JSON object with attributes to associate with the uploaded media',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForGetAll,
		},
		options: [
			{
				displayName: 'Created From',
				name: 'createdFrom',
				type: 'dateTime',
				default: '',
				description: 'Return uploads created after this date',
			},
			{
				displayName: 'Created To',
				name: 'createdTo',
				type: 'dateTime',
				default: '',
				description: 'Return uploads created before this date',
			},
			{
				displayName: 'Expired',
				name: 'expired',
				type: 'boolean',
				default: false,
				description: 'Whether to return expired uploads',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'Filter uploads by external ID',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: mediaTypeOptions,
				default: 'image',
				description: 'Filter uploads by media type',
			},
			{
				displayName: 'Next Cursor',
				name: 'nextCursor',
				type: 'number',
				default: 0,
				description: 'Cursor returned by the current page to advance',
			},
			{
				displayName: 'Previous Cursor',
				name: 'previousCursor',
				type: 'number',
				default: 0,
				description: 'Cursor returned by the current page to go back',
			},
		],
	},
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		description: 'ID of the uploaded media',
	},
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
		},
		description: 'ID of the uploaded media',
	},
	{
		displayName: 'Download By',
		name: 'downloadMode',
		type: 'options',
		options: [
			{
				name: 'Message Content',
				value: 'content',
			},
			{
				name: 'Message Database ID',
				value: 'id',
			},
			{
				name: 'Message Key ID',
				value: 'keyId',
			},
		],
		default: 'content',
		displayOptions: {
			show: showOnlyForDownload,
		},
		description: 'How to identify the message media to download',
	},
	{
		displayName: 'Message Database ID',
		name: 'messageDatabaseId',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForDownloadById,
		},
		description: 'Internal positive message ID',
	},
	{
		displayName: 'Message Key ID',
		name: 'keyId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadByKeyId,
		},
		description: 'WhatsApp message key ID',
	},
	{
		displayName: 'Message Key ID',
		name: 'keyId',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForDownloadByContent,
		},
		description: 'Optional WhatsApp message key ID',
	},
	{
		displayName: 'Message Type',
		name: 'messageType',
		type: 'options',
		options: [
			{
				name: 'Audio Message',
				value: 'audioMessage',
			},
			{
				name: 'Document Message',
				value: 'documentMessage',
			},
			{
				name: 'Image Message',
				value: 'imageMessage',
			},
			{
				name: 'Sticker Message',
				value: 'stickerMessage',
			},
			{
				name: 'Video Message',
				value: 'videoMessage',
			},
		],
		default: 'imageMessage',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadByContent,
		},
		description: 'WhatsApp message type, for example imageMessage, videoMessage, or audioMessage',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'json',
		default: '{}',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadByContent,
		},
		description: 'Media content object from the received WhatsApp message',
	},
	{
		displayName: 'Output Binary Field',
		name: 'outputBinaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForDownload,
		},
		description: 'Name of the binary field to write the downloaded media to',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForDownload,
		},
		description: 'Optional file name for the downloaded binary data',
	},
];
