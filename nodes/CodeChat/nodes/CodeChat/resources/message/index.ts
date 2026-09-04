import type { INodeProperties } from 'n8n-workflow';

import { sendCarouselDescription } from './sendCarousel';
import { sendContactDescription } from './sendContact';
import {
	sendButtonsDescription,
	sendCopyDescription,
	sendReplyDescription,
	sendUrlDescription,
} from './sendInteractive';
import { sendLinkDescription } from './sendLink';
import { sendLocationDescription } from './sendLocation';
import { sendMediaDescription } from './sendMedia';
import { sendMediaFileDescription } from './sendMediaFile';
import { sendPaymentRequestDescription } from './sendPaymentRequest';
import { sendPixDescription } from './sendPix';
import { sendPptDescription } from './sendPpt';
import { sendPptFileDescription } from './sendPptFile';
import { sendReactionDescription } from './sendReaction';
import { sendTextDescription } from './sendText';

const showOnlyForMessage = {
	resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: showOnlyForMessage,
		},

		options: [
			{
				name: 'Send Buttons',
				value: 'sendButtons',
				action: 'Send a buttons message',
				description: 'Send an interactive buttons message through WhatsApp',
			},
			{
				name: 'Send Carousel',
				value: 'sendCarousel',
				action: 'Send a carousel message',
				description: 'Send a carousel message through WhatsApp',
			},
			{
				name: 'Send Contact',
				value: 'sendContact',
				action: 'Send a contact message',
				description: 'Send one or more contacts through WhatsApp',
			},
			{
				name: 'Send Copy Button',
				value: 'sendCopy',
				action: 'Send a copy button message',
				description: 'Send an interactive copy-code button message through WhatsApp',
			},
			{
				name: 'Send Link',
				value: 'sendLink',
				action: 'Send a link message',
				description: 'Send a link preview message through WhatsApp',
			},
			{
				name: 'Send Location',
				value: 'sendLocation',
				action: 'Send a location message',
				description: 'Send a location through WhatsApp',
			},
			{
				name: 'Send Media',
				value: 'sendMedia',
				action: 'Send media from URL',
				description: 'Send image, document, video, or audio media from a URL',
			},
			{
				name: 'Send Media File',
				value: 'sendMediaFile',
				action: 'Send media from binary file',
				description: 'Upload and send image, document, video, or audio media from binary data',
			},
			{
				name: 'Send Payment Request',
				value: 'sendPaymentRequest',
				action: 'Send a payment request',
				description: 'Send a payment request through WhatsApp',
			},
			{
				name: 'Send PIX',
				value: 'sendPix',
				action: 'Send a pix message',
				description: 'Send a PIX payment message through WhatsApp',
			},
			{
				name: 'Send PTT',
				value: 'sendPpt',
				action: 'Send a push to talk audio message from url',
				description: 'Send a push-to-talk audio message from a URL',
			},
			{
				name: 'Send PTT File',
				value: 'sendPptFile',
				action: 'Send a push to talk audio message from binary file',
				description: 'Upload and send a push-to-talk audio message from binary data',
			},
			{
				name: 'Send Reaction',
				value: 'sendReaction',
				action: 'Send a reaction message',
				description: 'React to an existing WhatsApp message',
			},
			{
				name: 'Send Reply Buttons',
				value: 'sendReply',
				action: 'Send a reply buttons message',
				description: 'Send an interactive reply buttons message through WhatsApp',
			},
			{
				name: 'Send Text',
				value: 'sendText',
				action: 'Send a text message',
				description: 'Send a text message through WhatsApp',
			},
			{
				name: 'Send URL Button',
				value: 'sendUrl',
				action: 'Send a url button message',
				description: 'Send an interactive URL button message through WhatsApp',
			},
		],

		default: 'sendText',
	},

	...sendButtonsDescription,
	...sendReplyDescription,
	...sendUrlDescription,
	...sendCopyDescription,
	...sendTextDescription,
	...sendLinkDescription,
	...sendMediaDescription,
	...sendMediaFileDescription,
	...sendLocationDescription,
	...sendContactDescription,
	...sendReactionDescription,
	...sendPptDescription,
	...sendPptFileDescription,
	...sendPixDescription,
	...sendPaymentRequestDescription,
	...sendCarouselDescription,
];
