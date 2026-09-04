import type { INodeProperties } from 'n8n-workflow';

import { createMediaUploadId, createMessageOptions } from './shared';

const showOnlyForSendPaymentRequest = {
	resource: ['message'],
	operation: ['sendPaymentRequest'],
};

export const sendPaymentRequestDescription: INodeProperties[] = [
	{
		displayName: 'Chat',
		name: 'chat',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Recipient chat ID or phone number including country and area code',
	},
	createMediaUploadId({ show: showOnlyForSendPaymentRequest }),
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Title of the payment request',
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
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Description of the payment request',
	},
	{
		displayName: 'Footer Text',
		name: 'footerText',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Footer text of the payment request',
	},
	{
		displayName: 'Reference ID',
		name: 'referenceId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Payment request reference ID',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Digital Goods', value: 'digital-goods' },
			{ name: 'Physical Goods', value: 'physical-goods' },
		],
		default: 'physical-goods',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Order type for the payment request',
	},
	{
		displayName: 'Payment Type',
		name: 'paymentType',
		type: 'options',
		options: [{ name: 'Brazil', value: 'br' }],
		default: 'br',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Payment market/type',
	},
	{
		displayName: 'Payment Setting Type',
		name: 'paymentSettingType',
		type: 'options',
		options: [
			{ name: 'Boleto', value: 'boleto' },
			{ name: 'Payment Link', value: 'payment_link' },
			{ name: 'PIX Dynamic Code', value: 'pix_dynamic_code' },
		],
		default: 'boleto',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Payment setting to include. Only the selected type fields are shown.',
	},
	{
		displayName: 'Boleto Digitable Line',
		name: 'boletoDigitableLine',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['boleto'],
			},
		},
	},
	{
		displayName: 'PIX Dynamic Code',
		name: 'pixDynamicCode',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['pix_dynamic_code'],
			},
		},
	},
	{
		displayName: 'PIX Merchant Name',
		name: 'pixMerchantName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['pix_dynamic_code'],
			},
		},
		description: 'Merchant name for the PIX dynamic code',
	},
	{
		displayName: 'PIX Key Type',
		name: 'pixKeyType',
		type: 'options',
		options: [
			{ name: 'CNPJ', value: 'CNPJ' },
			{ name: 'CPF', value: 'CPF' },
			{ name: 'Email', value: 'EMAIL' },
			{ name: 'EVP', value: 'EVP' },
			{ name: 'Phone', value: 'PHONE' },
		],
		default: 'EVP',
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['pix_dynamic_code'],
			},
		},
	},
	{
		displayName: 'PIX Key',
		name: 'pixKey',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['pix_dynamic_code'],
			},
		},
	},
	{
		displayName: 'Payment Link URI',
		name: 'paymentLinkUri',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendPaymentRequest,
				paymentSettingType: ['payment_link'],
			},
		},
		description: 'Payment link URL',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: 'BRL',
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Currency code',
	},
	{
		displayName: 'Total Value',
		name: 'totalValue',
		type: 'number',
		default: 0,
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Total amount value in the API minor unit format',
	},
	{
		displayName: 'Amount Offset',
		name: 'amountOffset',
		type: 'number',
		default: 1000,
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		description: 'Offset used by amount fields',
	},
	{
		displayName: 'Order Status',
		name: 'orderStatus',
		type: 'string',
		default: 'payment_requested',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
	},
	{
		displayName: 'Order Type',
		name: 'orderType',
		type: 'string',
		default: 'ORDER',
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
	},
	{
		displayName: 'Order Items',
		name: 'orderItems',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		required: true,
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		options: [
			{
				displayName: 'Item',
				name: 'item',
				values: [
					{
						displayName: 'Amount Value',
						name: 'amountValue',
						type: 'number',
						default: 0,
						required: true,
					},
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Is Custom Item',
						name: 'isCustomItem',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Is Quantity Set',
						name: 'isQuantitySet',
						type: 'boolean',
						default: true,
					},
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: 'Quantity',
						name: 'quantity',
						type: 'number',
						default: 1,
						required: true,
					},
					{
						displayName: 'Retailer ID',
						name: 'retailerId',
						type: 'string',
						default: '',
						required: true,
					},
				],
			},
		],
		description: 'Items in the order',
	},
	{
		displayName: 'Order Totals',
		name: 'orderTotals',
		type: 'collection',
		placeholder: 'Add Total',
		default: {},
		displayOptions: {
			show: showOnlyForSendPaymentRequest,
		},
		options: [
			{
				displayName: 'Discount Description',
				name: 'discountDescription',
				type: 'string',
				default: '',
			},
			{ displayName: 'Discount Value', name: 'discountValue', type: 'number', default: 0 },
			{
				displayName: 'Shipping Description',
				name: 'shippingDescription',
				type: 'string',
				default: '',
			},
			{ displayName: 'Shipping Value', name: 'shippingValue', type: 'number', default: 0 },
			{ displayName: 'Subtotal Value', name: 'subtotalValue', type: 'number', default: 0 },
			{
				displayName: 'Tax Description',
				name: 'taxDescription',
				type: 'string',
				default: '',
			},
			{ displayName: 'Tax Value', name: 'taxValue', type: 'number', default: 0 },
		],
	},
	createMessageOptions({ show: showOnlyForSendPaymentRequest }),
];
