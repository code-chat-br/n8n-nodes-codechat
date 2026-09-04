import type { INodeProperties } from 'n8n-workflow';

import { createMediaUploadId, createMessageOptions } from './shared';

const showOnlyForSendPix = {
	resource: ['message'],
	operation: ['sendPix'],
};

export const sendPixDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	createMediaUploadId({ show: showOnlyForSendPix }),
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Title of the PIX message',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Description of the PIX message',
	},
	{
		displayName: 'Footer Text',
		name: 'footerText',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Footer text of the PIX message',
	},
	{
		displayName: 'Key Type',
		name: 'keyType',
		type: 'options',
		options: [
			{ name: 'CNPJ', value: 'CNPJ' },
			{ name: 'CPF', value: 'CPF' },
			{ name: 'Email', value: 'EMAIL' },
			{ name: 'EVP', value: 'EVP' },
			{ name: 'Phone', value: 'PHONE' },
		],
		default: 'EVP',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Type of PIX key',
	},
	{
		displayName: 'Merchant Name',
		name: 'merchantName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Merchant name to display',
	},
	{
		displayName: 'Key',
		name: 'key',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'PIX key or dynamic QR payload',
	},
	{
		displayName: 'Reference ID',
		name: 'referenceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPix,
		},
		description: 'Payment reference ID',
	},
	createMessageOptions({ show: showOnlyForSendPix }),
];
