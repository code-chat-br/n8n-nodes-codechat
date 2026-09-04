import type { INodeProperties } from 'n8n-workflow';

const showOnlyForInstance = {
	resource: ['instance'],
};

const showOnlyForConnectCode = {
	resource: ['instance'],
	operation: ['connectCode'],
};

export const instanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForInstance,
		},
		options: [
			{
				name: 'Connect With Code',
				value: 'connectCode',
				action: 'Connect an instance with a pairing code',
				description: 'Request a WhatsApp pairing code for the instance',
			},
			{
				name: 'Connect With QR Code',
				value: 'connectQr',
				action: 'Connect an instance with QR code',
				description: 'Start or check the QR Code connection flow',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an instance',
				description: 'Get the configured instance',
			},
			{
				name: 'Get Connection Status',
				value: 'getConnectionStatus',
				action: 'Get instance connection status',
				description: 'Get the WhatsApp connection status for the instance',
			},
			{
				name: 'Logout',
				value: 'logout',
				action: 'Logout an instance',
				description: 'Disconnect the WhatsApp session',
			},
		],
		default: 'get',
	},
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForConnectCode,
		},
		placeholder: '5511999999999',
		description: 'Phone number to request a WhatsApp pairing code for',
	},
];
