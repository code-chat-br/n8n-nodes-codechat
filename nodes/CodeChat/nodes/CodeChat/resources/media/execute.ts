import type {
	IBinaryData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import {
	getBaseUrl,
	getInstancePath,
	handleCodeChatError,
	parseJsonObject,
	removeEmptyFields,
} from '../shared';

type MediaOperation = 'delete' | 'download' | 'get' | 'getAll' | 'upload';
type DownloadMode = 'content' | 'id' | 'keyId';

function appendOptionalFormValue(
	formData: FormData,
	name: string,
	value: string | IDataObject,
): void {
	if (value === '') {
		return;
	}

	formData.append(name, typeof value === 'object' ? JSON.stringify(value) : value);
}

function appendFile(formData: FormData, binaryBuffer: Buffer, binaryData: IBinaryData): void {
	const fileName = binaryData.fileName ?? 'file';
	const mimeType = binaryData.mimeType ?? 'application/octet-stream';
	const file = new Blob([binaryBuffer], { type: mimeType });

	formData.append('file', file, fileName);
}

async function createUploadBody(context: IExecuteFunctions, itemIndex: number): Promise<FormData> {
	const binaryPropertyName = context.getNodeParameter('binaryPropertyName', itemIndex) as string;
	const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const binaryBuffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
	const externalAttributes = parseJsonObject(
		context,
		context.getNodeParameter('externalAttributes', itemIndex) as string,
		'External Attributes',
		itemIndex,
	) ?? {};
	const formData = new FormData();

	appendFile(formData, binaryBuffer, binaryData);
	formData.append('mediaType', context.getNodeParameter('mediaType', itemIndex) as string);
	appendOptionalFormValue(
		formData,
		'externalId',
		context.getNodeParameter('externalId', itemIndex) as string,
	);

	if (Object.keys(externalAttributes).length > 0) {
		appendOptionalFormValue(formData, 'externalAttributes', externalAttributes);
	}

	return formData;
}

function createDownloadBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const downloadMode = context.getNodeParameter('downloadMode', itemIndex) as DownloadMode;

	if (downloadMode === 'id') {
		return {
			id: context.getNodeParameter('messageDatabaseId', itemIndex) as number,
		};
	}

	if (downloadMode === 'keyId') {
		return {
			keyId: context.getNodeParameter('keyId', itemIndex) as string,
		};
	}

	return removeEmptyFields({
		messageType: context.getNodeParameter('messageType', itemIndex) as string,
		content: parseJsonObject(
			context,
			context.getNodeParameter('content', itemIndex) as string,
			'Content',
			itemIndex,
			false,
		),
		keyId: context.getNodeParameter('keyId', itemIndex) as string,
	});
}

function createGetAllQuery(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const filters = context.getNodeParameter('filters', itemIndex, {}) as IDataObject;
	const query: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value === '' || value === 0 || value === undefined || value === null) {
			continue;
		}

		query[key] = value;
	}

	return query;
}

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: MediaOperation,
	body?: FormData | IDataObject,
	mediaId?: number,
	qs?: IDataObject,
): IHttpRequestOptions {
	const baseURL = getBaseUrl(credentials);
	const instancePath = getInstancePath(credentials);

	if (operation === 'upload') {
		return {
			method: 'POST',
			baseURL,
			url: `${instancePath}/media/uploads`,
			headers: {
				Accept: 'application/json',
			},
			body,
			json: false,
		};
	}

	if (operation === 'getAll') {
		return {
			method: 'GET',
			baseURL,
			url: `${instancePath}/media/uploads`,
			headers: {
				Accept: 'application/json',
			},
			qs,
			json: true,
		};
	}

	if (operation === 'download') {
		return {
			method: 'POST',
			baseURL,
			url: `${instancePath}/media/data`,
			headers: {
				Accept: 'application/octet-stream',
				'Content-Type': 'application/json',
			},
			qs: {
				binary: true,
			},
			body,
			encoding: 'arraybuffer',
			json: false,
		};
	}

	return {
		method: operation === 'delete' ? 'DELETE' : 'GET',
		baseURL,
		url: `${instancePath}/media/${mediaId}/uploads`,
		headers: {
			Accept: 'application/json',
		},
		json: true,
	};
}

async function executeDownload(
	context: IExecuteFunctions,
	credentials: CodeChatCredentials,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const outputBinaryPropertyName = context.getNodeParameter(
		'outputBinaryPropertyName',
		itemIndex,
	) as string;
	const fileName = context.getNodeParameter('fileName', itemIndex) as string;
	const requestOptions = createRequestOptions(
		credentials,
		'download',
		createDownloadBody(context, itemIndex),
	);
	const responseData = (await context.helpers.httpRequestWithAuthentication.call(
		context,
		'codeChatApi',
		requestOptions,
	)) as ArrayBuffer | Buffer;
	const binaryBuffer = Buffer.isBuffer(responseData) ? responseData : Buffer.from(responseData);
	const binaryData = await context.helpers.prepareBinaryData(
		binaryBuffer,
		fileName || 'codechat-media',
	);

	return {
		json: {
			fileName: binaryData.fileName,
			mimeType: binaryData.mimeType,
			fileSize: binaryData.fileSize,
		},
		binary: {
			[outputBinaryPropertyName]: binaryData,
		},
		pairedItem: { item: itemIndex },
	};
}

export async function executeMedia(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as MediaOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);

			if (operation === 'download') {
				returnData.push(await executeDownload(this, credentials, itemIndex));
				continue;
			}

			const mediaId =
				operation === 'get' || operation === 'delete'
					? (this.getNodeParameter('mediaId', itemIndex) as number)
					: undefined;
			const requestOptions = createRequestOptions(
				credentials,
				operation,
				operation === 'upload' ? await createUploadBody(this, itemIndex) : undefined,
				mediaId,
				operation === 'getAll' ? createGetAllQuery(this, itemIndex) : undefined,
			);
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				requestOptions,
			)) as IDataObject | IDataObject[] | undefined;

			if (operation === 'getAll' && Array.isArray(responseData)) {
				returnData.push(
					...responseData.map((media) => ({
						json: media,
						pairedItem: { item: itemIndex },
					})),
				);
				continue;
			}

			returnData.push({
				json: Array.isArray(responseData) ? { data: responseData } : (responseData ?? { success: true }),
				pairedItem: { item: itemIndex },
			});
		} catch (error) {
			returnData.push(handleCodeChatError(this, error, itemIndex));
		}
	}

	return [returnData];
}
