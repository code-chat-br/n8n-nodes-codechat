import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendContact = {
	resource: ['message'],
	operation: ['sendContact'],
};

export const sendContactDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendContact,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		displayOptions: {
			show: showOnlyForSendContact,
		},
		options: [
			{
				displayName: 'Contact',
				name: 'contact',
				values: [
					{
						displayName: 'Full Name',
						name: 'fullName',
						type: 'string',
						default: '',
						required: true,
						description: 'Full name of the contact',
					},
					{
						displayName: 'WUID',
						name: 'wuid',
						type: 'string',
						default: '',
						required: true,
						description: 'WhatsApp user ID of the contact',
					},
					{
						displayName: 'Phone Number',
						name: 'phoneNumber',
						type: 'string',
						default: '',
						required: true,
						description: 'Phone number of the contact',
					},
				],
			},
		],
		description: 'Contacts to send',
	},
	createMessageOptions({ show: showOnlyForSendContact }),
];
