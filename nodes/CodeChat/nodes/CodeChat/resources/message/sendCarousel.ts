import type { INodeProperties } from 'n8n-workflow';

import { createMessageOptions } from './shared';

const showOnlyForSendCarousel = {
	resource: ['message'],
	operation: ['sendCarousel'],
};

export const sendCarouselDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendCarousel,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendCarousel,
		},
		description: 'Title of the carousel message',
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
			show: showOnlyForSendCarousel,
		},
		description: 'Description of the carousel message',
	},
	{
		displayName: 'Footer Text',
		name: 'footerText',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendCarousel,
		},
		description: 'Footer text of the carousel message',
	},
	{
		displayName: 'Cards JSON',
		name: 'cardsJson',
		type: 'json',
		default:
			'[\n  {\n    "title": "Plano Pro",\n    "description": "Automacao completa",\n    "footerText": "R$ 99",\n    "mediaUploadId": 1,\n    "buttons": [\n      { "displayText": "Selecionar", "id": "plan-pro" },\n      { "displayText": "Abrir", "type": "url", "value": "https://example.com/pro" }\n    ]\n  }\n]',
		required: true,
		displayOptions: {
			show: showOnlyForSendCarousel,
		},
		description: 'Cards array for the carousel message',
	},
	createMessageOptions({ show: showOnlyForSendCarousel }),
];
