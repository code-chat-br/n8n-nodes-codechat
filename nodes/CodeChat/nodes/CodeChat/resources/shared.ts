import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export interface CodeChatCredentials {
	baseUrl: string;
	instanceName: string;
	accessToken: string;
}

export function getBaseUrl(credentials: CodeChatCredentials): string {
	return credentials.baseUrl.replace(/\/$/, '');
}

export function getInstancePath(credentials: CodeChatCredentials): string {
	return `/instance/${encodeURIComponent(credentials.instanceName)}`;
}

export function createJsonRequest(
	credentials: CodeChatCredentials,
	method: IHttpRequestOptions['method'],
	url: string,
	body?: IDataObject,
	qs?: IDataObject,
): IHttpRequestOptions {
	return {
		method,
		baseURL: getBaseUrl(credentials),
		url,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		...(body ? { body } : {}),
		...(qs ? { qs } : {}),
		json: true,
	};
}

export function removeEmptyFields<T extends IDataObject>(body: T): T {
	for (const key of Object.keys(body)) {
		if (body[key] === '' || body[key] === undefined || body[key] === null) {
			delete body[key];
		}
	}

	return body;
}

export function parseJsonObject(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
	itemIndex: number,
	allowEmpty = true,
): IDataObject | undefined {
	if (allowEmpty && !value.trim()) {
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

export function parseStringList(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
	itemIndex: number,
): string[] {
	const items = value
		.split(/[\n,]/)
		.map((item) => item.trim())
		.filter(Boolean);

	if (items.length === 0) {
		throw new NodeOperationError(context.getNode(), `${fieldName} must contain at least one item`, {
			itemIndex,
		});
	}

	return items;
}

export function parseNumberList(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
	itemIndex: number,
): number[] {
	const items = parseStringList(context, value, fieldName, itemIndex).map((item) => {
		const numberValue = Number(item);

		if (!Number.isInteger(numberValue) || numberValue < 1) {
			throw new NodeOperationError(
				context.getNode(),
				`${fieldName} must contain only positive integers`,
				{
					itemIndex,
				},
			);
		}

		return numberValue;
	});

	return items;
}

export function handleCodeChatError(
	context: IExecuteFunctions,
	error: unknown,
	itemIndex: number,
): INodeExecutionData {
	if (context.continueOnFail()) {
		return {
			json: {
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			pairedItem: { item: itemIndex },
		};
	}

	if (error instanceof NodeOperationError) {
		throw new NodeOperationError(context.getNode(), error.message, { itemIndex });
	}

	throw new NodeApiError(
		context.getNode(),
		{
			message: error instanceof Error ? error.message : 'Unknown API error',
		},
		{ itemIndex },
	);
}
