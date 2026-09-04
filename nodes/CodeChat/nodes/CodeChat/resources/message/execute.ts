import type {
	IBinaryData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { getMessageOptions } from './shared';

interface CodeChatCredentials {
	baseUrl: string;
	instanceName: string;
	accessToken: string;
}

interface ContactCollection {
	contact?: IDataObject[];
}

interface ButtonCollection {
	button?: IDataObject[];
}

interface OrderItemCollection {
	item?: IDataObject[];
}

type MessageOperation =
	| 'sendButtons'
	| 'sendCarousel'
	| 'sendContact'
	| 'sendCopy'
	| 'sendLink'
	| 'sendLocation'
	| 'sendMedia'
	| 'sendMediaFile'
	| 'sendPaymentRequest'
	| 'sendPix'
	| 'sendPpt'
	| 'sendPptFile'
	| 'sendReaction'
	| 'sendReply'
	| 'sendText'
	| 'sendUrl';

function addOptionalField(
	target: IDataObject,
	name: string,
	value: string | number | boolean,
): void {
	if (value !== '' && value !== undefined) {
		target[name] = value;
	}
}

function addOptionalPositiveNumber(target: IDataObject, name: string, value: number): void {
	if (value > 0) {
		target[name] = value;
	}
}

function createButtonMessage(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const buttons = context.getNodeParameter('buttons', itemIndex, {}) as ButtonCollection;

	if (!buttons.button?.length) {
		throw new NodeOperationError(context.getNode(), 'At least one button must be added', {
			itemIndex,
		});
	}

	return {
		title: context.getNodeParameter('title', itemIndex) as string,
		description: context.getNodeParameter('description', itemIndex) as string,
		footerText: context.getNodeParameter('footerText', itemIndex) as string,
		buttons: buttons.button.map((button) => {
			const type = button.type as string;
			const output: IDataObject = {
				displayText: button.displayText as string,
			};

			if (type === 'id') {
				output.id = button.value as string;
			}

			if (type === 'url') {
				output.url = button.value as string;
			}

			if (type === 'copyCode') {
				output.copyCode = button.value as string;
			}

			return output;
		}),
	};
}

function parseJsonArray(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
	itemIndex: number,
): IDataObject[] {
	try {
		const parsed = JSON.parse(value) as unknown;

		if (!Array.isArray(parsed)) {
			throw new Error(`${fieldName} must be a JSON array`);
		}

		return parsed as IDataObject[];
	} catch (error) {
		throw new NodeOperationError(context.getNode(), `${fieldName} must be a valid JSON array`, {
			description: error instanceof Error ? error.message : undefined,
			itemIndex,
		});
	}
}

function createPaymentSetting(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const paymentSettingType = context.getNodeParameter('paymentSettingType', itemIndex) as string;

	if (paymentSettingType === 'boleto') {
		return {
			type: 'boleto',
			boleto: {
				digitableLine: context.getNodeParameter('boletoDigitableLine', itemIndex) as string,
			},
		};
	}

	if (paymentSettingType === 'pix_dynamic_code') {
		return {
			type: 'pix_dynamic_code',
			pixDynamicCode: {
				code: context.getNodeParameter('pixDynamicCode', itemIndex) as string,
				merchantName: context.getNodeParameter('pixMerchantName', itemIndex) as string,
				keyType: context.getNodeParameter('pixKeyType', itemIndex) as string,
				key: context.getNodeParameter('pixKey', itemIndex) as string,
			},
		};
	}

	return {
		type: 'payment_link',
		paymentLink: {
			uri: context.getNodeParameter('paymentLinkUri', itemIndex) as string,
		},
	};
}

function createPaymentRequest(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const amountOffset = context.getNodeParameter('amountOffset', itemIndex) as number;
	const orderItems = context.getNodeParameter('orderItems', itemIndex, {}) as OrderItemCollection;
	const orderTotals = context.getNodeParameter('orderTotals', itemIndex, {}) as IDataObject;

	if (!orderItems.item?.length) {
		throw new NodeOperationError(context.getNode(), 'At least one order item must be added', {
			itemIndex,
		});
	}

	const order: IDataObject = {
		status: context.getNodeParameter('orderStatus', itemIndex) as string,
		orderType: context.getNodeParameter('orderType', itemIndex) as string,
		items: orderItems.item.map((item) => ({
			retailerId: item.retailerId,
			name: item.name,
			amount: {
				value: item.amountValue,
				offset: amountOffset,
			},
			quantity: item.quantity,
			isCustomItem: item.isCustomItem,
			isQuantitySet: item.isQuantitySet,
			description: item.description,
		})),
	};

	addAmountObject(order, 'subtotal', orderTotals.subtotalValue as number | undefined, amountOffset);
	addAmountObject(
		order,
		'tax',
		orderTotals.taxValue as number | undefined,
		amountOffset,
		orderTotals.taxDescription as string | undefined,
	);
	addAmountObject(
		order,
		'shipping',
		orderTotals.shippingValue as number | undefined,
		amountOffset,
		orderTotals.shippingDescription as string | undefined,
	);
	addAmountObject(
		order,
		'discount',
		orderTotals.discountValue as number | undefined,
		amountOffset,
		orderTotals.discountDescription as string | undefined,
	);

	return {
		title: context.getNodeParameter('title', itemIndex) as string,
		description: context.getNodeParameter('description', itemIndex) as string,
		footerText: context.getNodeParameter('footerText', itemIndex) as string,
		referenceId: context.getNodeParameter('referenceId', itemIndex) as string,
		type: context.getNodeParameter('type', itemIndex) as string,
		paymentType: context.getNodeParameter('paymentType', itemIndex) as string,
		paymentSettings: [createPaymentSetting(context, itemIndex)],
		currency: context.getNodeParameter('currency', itemIndex) as string,
		totalAmount: {
			value: context.getNodeParameter('totalValue', itemIndex) as number,
			offset: amountOffset,
		},
		order,
	};
}

function addAmountObject(
	target: IDataObject,
	name: string,
	value: number | undefined,
	offset: number,
	description?: string,
): void {
	if (value === undefined || value <= 0) {
		return;
	}

	const amount: IDataObject = {
		value,
		offset,
	};

	if (description) {
		amount.description = description;
	}

	target[name] = amount;
}

function createJsonBody(
	context: IExecuteFunctions,
	operation: MessageOperation,
	itemIndex: number,
): IDataObject {
	const options = getMessageOptions(context, itemIndex);

	if (operation === 'sendReaction') {
		return {
			reactionMessage: {
				key: {
					remoteJid: context.getNodeParameter('remoteJid', itemIndex) as string,
					fromMe: context.getNodeParameter('fromMe', itemIndex) as boolean,
					id: context.getNodeParameter('messageId', itemIndex) as string,
				},
				reaction: context.getNodeParameter('reaction', itemIndex) as string,
			},
		};
	}

	const body: IDataObject = {
		chat: context.getNodeParameter('chat', itemIndex) as string,
	};
	addOptionalPositiveNumber(
		body,
		'mediaUploadId',
		context.getNodeParameter('mediaUploadId', itemIndex, 0) as number,
	);

	if (options) {
		body.options = options;
	}

	if (
		operation === 'sendButtons' ||
		operation === 'sendReply' ||
		operation === 'sendUrl' ||
		operation === 'sendCopy'
	) {
		body.buttonMessage = createButtonMessage(context, itemIndex);
	}

	if (operation === 'sendText') {
		body.textMessage = {
			text: context.getNodeParameter('text', itemIndex) as string,
		};
	}

	if (operation === 'sendLink') {
		const linkMessage: IDataObject = {
			link: context.getNodeParameter('link', itemIndex) as string,
		};

		addOptionalField(
			linkMessage,
			'thumbnailUrl',
			context.getNodeParameter('thumbnailUrl', itemIndex) as string,
		);
		addOptionalField(linkMessage, 'title', context.getNodeParameter('title', itemIndex) as string);
		addOptionalField(
			linkMessage,
			'description',
			context.getNodeParameter('description', itemIndex) as string,
		);
		body.linkMessage = linkMessage;
	}

	if (operation === 'sendMedia') {
		const mediaSource = context.getNodeParameter('mediaSource', itemIndex) as string;
		const mediaMessage: IDataObject = {
			mediatype: context.getNodeParameter('mediaType', itemIndex) as string,
		};

		if (mediaSource === 'uploadId') {
			mediaMessage.mediaUploadId = context.getNodeParameter('uploadedMediaId', itemIndex) as number;
		} else {
			mediaMessage.media = context.getNodeParameter('media', itemIndex) as string;
		}

		addOptionalField(
			mediaMessage,
			'fileName',
			context.getNodeParameter('fileName', itemIndex) as string,
		);
		addOptionalField(
			mediaMessage,
			'caption',
			context.getNodeParameter('caption', itemIndex) as string,
		);
		body.mediaMessage = mediaMessage;
	}

	if (operation === 'sendLocation') {
		const locationMessage: IDataObject = {
			latitude: context.getNodeParameter('latitude', itemIndex) as number,
			longitude: context.getNodeParameter('longitude', itemIndex) as number,
		};

		addOptionalField(
			locationMessage,
			'name',
			context.getNodeParameter('name', itemIndex) as string,
		);
		addOptionalField(
			locationMessage,
			'address',
			context.getNodeParameter('address', itemIndex) as string,
		);
		body.locationMessage = locationMessage;
	}

	if (operation === 'sendContact') {
		const contacts = context.getNodeParameter('contacts', itemIndex, {}) as ContactCollection;

		if (!contacts.contact?.length) {
			throw new NodeOperationError(context.getNode(), 'At least one contact must be added', {
				itemIndex,
			});
		}

		body.contactMessage = contacts.contact;
	}

	if (operation === 'sendPpt') {
		body.audioMessage = {
			audio: context.getNodeParameter('audio', itemIndex) as string,
		};
	}

	if (operation === 'sendPix') {
		body.pix = {
			title: context.getNodeParameter('title', itemIndex) as string,
			description: context.getNodeParameter('description', itemIndex) as string,
			footerText: context.getNodeParameter('footerText', itemIndex) as string,
			keyType: context.getNodeParameter('keyType', itemIndex) as string,
			merchantName: context.getNodeParameter('merchantName', itemIndex) as string,
			key: context.getNodeParameter('key', itemIndex) as string,
			referenceId: context.getNodeParameter('referenceId', itemIndex) as string,
		};
	}

	if (operation === 'sendPaymentRequest') {
		body.paymentRequest = createPaymentRequest(context, itemIndex);
	}

	if (operation === 'sendCarousel') {
		body.carouselMessage = {
			title: context.getNodeParameter('title', itemIndex) as string,
			description: context.getNodeParameter('description', itemIndex) as string,
			footerText: context.getNodeParameter('footerText', itemIndex) as string,
			cards: parseJsonArray(
				context,
				context.getNodeParameter('cardsJson', itemIndex) as string,
				'Cards JSON',
				itemIndex,
			),
		};
	}

	return body;
}

function appendOptionalFormValue(
	formData: FormData,
	name: string,
	value: string | number | boolean | IDataObject | undefined,
): void {
	if (value === undefined || value === '') {
		return;
	}

	formData.append(name, typeof value === 'object' ? JSON.stringify(value) : String(value));
}

async function createMultipartBody(
	context: IExecuteFunctions,
	operation: MessageOperation,
	itemIndex: number,
): Promise<FormData> {
	const binaryPropertyName = context.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const binaryBuffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const formData = new FormData();
	const options = getMessageOptions(context, itemIndex);

	formData.append('chat', context.getNodeParameter('chat', itemIndex) as string);
	appendOptionalFormValue(formData, 'delay', options?.delay as number | undefined);
	appendOptionalFormValue(formData, 'presence', options?.presence as string | undefined);
	appendOptionalFormValue(
		formData,
		'quotedMessageId',
		options?.quotedMessageId as number | undefined,
	);
	appendOptionalFormValue(
		formData,
		'quotedMessage',
		options?.quotedMessage as IDataObject | undefined,
	);
	appendOptionalFormValue(
		formData,
		'externalAttributes',
		options?.externalAttributes as IDataObject | undefined,
	);
	appendOptionalFormValue(formData, 'mentionAll', options?.mentionAll as boolean | undefined);
	appendFile(formData, binaryBuffer, binaryData);

	if (operation === 'sendMediaFile') {
		appendOptionalFormValue(
			formData,
			'caption',
			context.getNodeParameter('caption', itemIndex) as string,
		);
		formData.append('mediaType', context.getNodeParameter('mediaType', itemIndex) as string);
	}

	return formData;
}

function appendFile(formData: FormData, binaryBuffer: Buffer, binaryData: IBinaryData): void {
	const fileName = binaryData.fileName ?? 'attachment';
	const mimeType = binaryData.mimeType ?? 'application/octet-stream';
	const file = new Blob([binaryBuffer], { type: mimeType });

	formData.append('attachment', file, fileName);
}

function getEndpoint(operation: MessageOperation): string {
	const endpoints: Record<MessageOperation, string> = {
		sendButtons: '/send/buttons',
		sendCarousel: '/send/carousel',
		sendContact: '/send/contact',
		sendCopy: '/send/copy',
		sendLink: '/send/link',
		sendLocation: '/send/location',
		sendMedia: '/send/media',
		sendMediaFile: '/send/media-file',
		sendPaymentRequest: '/send/payment-request',
		sendPix: '/send/pix',
		sendPpt: '/send/ppt',
		sendPptFile: '/send/ppt-file',
		sendReaction: '/send/reaction',
		sendReply: '/send/reply',
		sendText: '/send/text',
		sendUrl: '/send/url',
	};

	return endpoints[operation];
}

export async function executeMessage(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as MessageOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);
			const isMultipart = operation === 'sendMediaFile' || operation === 'sendPptFile';
			const requestOptions: IHttpRequestOptions = {
				method: 'POST',
				baseURL: credentials.baseUrl.replace(/\/$/, ''),
				url: `/instance/${encodeURIComponent(credentials.instanceName)}${getEndpoint(operation)}`,
				headers: isMultipart
					? {
							Accept: 'application/json',
						}
					: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
				body: isMultipart
					? await createMultipartBody(this, operation, itemIndex)
					: createJsonBody(this, operation, itemIndex),
				json: !isMultipart,
			};

			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				requestOptions,
			)) as IDataObject;

			returnData.push({
				json: responseData,
				pairedItem: { item: itemIndex },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error instanceof Error ? error.message : 'Unknown error',
					},
					pairedItem: { item: itemIndex },
				});
				continue;
			}

			if (error instanceof NodeOperationError) {
				throw new NodeOperationError(this.getNode(), error.message, { itemIndex });
			}

			throw new NodeApiError(
				this.getNode(),
				{
					message: error instanceof Error ? error.message : 'Unknown API error',
				},
				{ itemIndex },
			);
		}
	}

	return [returnData];
}
