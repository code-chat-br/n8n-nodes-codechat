import type {
	IDataObject,
	IDisplayOptions,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export const presenceOptions = [
	{
		name: 'Available',
		value: 'available',
	},
	{
		name: 'Composing',
		value: 'composing',
	},
	{
		name: 'Paused',
		value: 'paused',
	},
	{
		name: 'Recording',
		value: 'recording',
	},
	{
		name: 'Unavailable',
		value: 'unavailable',
	},
];

export function createMessageOptions(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions,
		options: [
			{
				displayName: 'Delay',
				name: 'delay',
				type: 'number',
				default: 1200,
				description: 'Delay in milliseconds before sending the message',
			},
			{
				displayName: 'External Attributes',
				name: 'externalAttributes',
				type: 'json',
				default: '{}',
				description: 'Additional attributes to send with the message',
			},
			{
				displayName: 'Mention All',
				name: 'mentionAll',
				type: 'boolean',
				default: false,
				description: 'Whether to mention all participants in a group chat',
			},
			{
				displayName: 'Presence',
				name: 'presence',
				type: 'options',
				options: presenceOptions,
				default: 'composing',
				description: 'Presence state to display before sending the message',
			},
			{
				displayName: 'Quoted Message',
				name: 'quotedMessage',
				type: 'json',
				default: '{}',
				description: 'Full quoted message object to reply to',
			},
			{
				displayName: 'Quoted Message ID',
				name: 'quotedMessageId',
				type: 'number',
				default: 0,
				description: 'ID of the quoted message to reply to',
			},
		],
	};
}

export function createMediaUploadId(displayOptions: IDisplayOptions): INodeProperties {
	return {
		displayName: 'Media Upload ID',
		name: 'mediaUploadId',
		type: 'number',
		default: 0,
		displayOptions,
		description: 'Optional uploaded media ID to attach to the message',
	};
}

export function parseJsonObject(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
	itemIndex: number,
): IDataObject | undefined {
	if (!value.trim()) {
		return undefined;
	}

	try {
		const parsed = JSON.parse(value) as unknown;

		if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
			throw new Error(`${fieldName} must be a JSON object`);
		}

		return parsed as IDataObject;
	} catch (error) {
		throw new NodeOperationError(context.getNode(), `${fieldName} must be a valid JSON object`, {
			description: error instanceof Error ? error.message : undefined,
			itemIndex,
		});
	}
}

export function getMessageOptions(
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject | undefined {
	const options = context.getNodeParameter('options', itemIndex, {}) as IDataObject;
	const body: IDataObject = {};
	const delay = options.delay as number | undefined;
	const mentionAll = options.mentionAll as boolean | undefined;
	const presence = options.presence as string | undefined;
	const quotedMessageId = options.quotedMessageId as number | undefined;
	const quotedMessage = parseJsonObject(
		context,
		(options.quotedMessage as string | undefined) ?? '',
		'Quoted Message',
		itemIndex,
	);
	const externalAttributes = parseJsonObject(
		context,
		(options.externalAttributes as string | undefined) ?? '',
		'External Attributes',
		itemIndex,
	);

	if (delay !== undefined) {
		body.delay = delay;
	}

	if (mentionAll !== undefined) {
		body.mentionAll = mentionAll;
	}

	if (presence) {
		body.presence = presence;
	}

	if (quotedMessageId !== undefined) {
		body.quotedMessageId = quotedMessageId;
	}

	if (quotedMessage) {
		body.quotedMessage = quotedMessage;
	}

	if (externalAttributes) {
		body.externalAttributes = externalAttributes;
	}

	return Object.keys(body).length > 0 ? body : undefined;
}
