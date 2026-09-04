import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendLocation = {
	resource: ['message'],
	operation: ['sendLocation'],
};

export const sendLocationDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendLocation,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Latitude',
		name: 'latitude',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForSendLocation,
		},
		description: 'Latitude of the location',
	},
	{
		displayName: 'Longitude',
		name: 'longitude',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForSendLocation,
		},
		description: 'Longitude of the location',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendLocation,
		},
		description: 'Name of the location',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendLocation,
		},
		description: 'Address of the location',
	},
	createMessageOptions({ show: showOnlyForSendLocation }),
];
