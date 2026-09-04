import type {
	IBinaryData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import { createJsonRequest, getBaseUrl, handleCodeChatError, removeEmptyFields } from '../shared';

type CallOperation =
	| 'downloadRecording'
	| 'get'
	| 'hangup'
	| 'list'
	| 'playAudio'
	| 'reject'
	| 'start'
	| 'startRecording'
	| 'stopAudio'
	| 'stopRecording';

type DownloadType = 'audio' | 'incomingVideo' | 'outgoingVideo' | 'recording';

function getCallBasePath(credentials: CodeChatCredentials): string {
	return `/call/${encodeURIComponent(credentials.instanceName)}`;
}

function appendOptionalFormValue(
	formData: FormData,
	name: string,
	value: string | number | boolean | undefined,
): void {
	if (value === undefined || value === '') {
		return;
	}

	formData.append(name, String(value));
}

function appendFile(formData: FormData, binaryBuffer: Buffer, binaryData: IBinaryData): void {
	const fileName = binaryData.fileName ?? 'audio';
	const mimeType = binaryData.mimeType ?? 'application/octet-stream';
	const file = new Blob([binaryBuffer], { type: mimeType });

	formData.append('file', file, fileName);
}

function createListQuery(context: IExecuteFunctions, itemIndex: number): IDataObject {
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

function createStartBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const body: IDataObject = {
		target: context.getNodeParameter('target', itemIndex) as string,
		video: context.getNodeParameter('video', itemIndex) as boolean,
		externalId: context.getNodeParameter('externalId', itemIndex) as string,
	};
	const recordingEnabled = context.getNodeParameter('recordingEnabled', itemIndex) as boolean;

	if (recordingEnabled) {
		body.recording = {
			enabled: true,
			audio: context.getNodeParameter('recordAudio', itemIndex) as boolean,
			video: context.getNodeParameter('recordVideo', itemIndex) as boolean,
		};
	}

	return removeEmptyFields(body);
}

function createReasonBody(context: IExecuteFunctions, itemIndex: number): IDataObject | undefined {
	return removeEmptyFields({
		reason: context.getNodeParameter('reason', itemIndex) as string,
	});
}

function createStartRecordingBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	return removeEmptyFields({
		...(context.getNodeParameter('recordingOptions', itemIndex, {}) as IDataObject),
	});
}

async function createPlayAudioBody(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<FormData | IDataObject> {
	const audioSource = context.getNodeParameter('audioSource', itemIndex) as string;
	const loop = context.getNodeParameter('loop', itemIndex) as boolean;
	const replaceCurrent = context.getNodeParameter('replaceCurrent', itemIndex) as boolean;

	if (audioSource === 'binary') {
		const binaryPropertyName = context.getNodeParameter('binaryPropertyName', itemIndex) as string;
		const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
		const binaryBuffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
		const formData = new FormData();

		appendFile(formData, binaryBuffer, binaryData);
		appendOptionalFormValue(formData, 'loop', loop);
		appendOptionalFormValue(formData, 'replaceCurrent', replaceCurrent);

		return formData;
	}

	return {
		url: context.getNodeParameter('audioUrl', itemIndex) as string,
		loop,
		replaceCurrent,
	};
}

function getDownloadUrl(
	credentials: CodeChatCredentials,
	callId: string,
	downloadType: DownloadType,
	recordingId: string,
): string {
	const callPath = `${getCallBasePath(credentials)}/${encodeURIComponent(callId)}`;

	if (downloadType === 'audio') {
		return `${callPath}/recordings/audio/download`;
	}

	if (downloadType === 'incomingVideo') {
		return `${callPath}/recordings/video/incoming/download`;
	}

	if (downloadType === 'outgoingVideo') {
		return `${callPath}/recordings/video/outgoing/download`;
	}

	return `${callPath}/recordings/${encodeURIComponent(recordingId)}/download`;
}

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: CallOperation,
	callId?: string,
	body?: IDataObject | FormData,
	qs?: IDataObject,
): IHttpRequestOptions {
	const callBasePath = getCallBasePath(credentials);

	if (operation === 'playAudio') {
		const isMultipart = body instanceof FormData;

		return {
			method: 'POST',
			baseURL: getBaseUrl(credentials),
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/audio/play`,
			headers: isMultipart
				? {
						Accept: 'application/json',
					}
				: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
			body,
			json: !isMultipart,
		};
	}

	const requestMap: Partial<
		Record<
			CallOperation,
			{
				method: 'GET' | 'POST';
				url: string;
			}
		>
	> = {
		get: {
			method: 'GET',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}`,
		},
		hangup: {
			method: 'POST',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/hangup`,
		},
		list: {
			method: 'GET',
			url: callBasePath,
		},
		reject: {
			method: 'POST',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/reject`,
		},
		start: {
			method: 'POST',
			url: callBasePath,
		},
		startRecording: {
			method: 'POST',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/recording/start`,
		},
		stopAudio: {
			method: 'POST',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/audio/stop`,
		},
		stopRecording: {
			method: 'POST',
			url: `${callBasePath}/${encodeURIComponent(callId ?? '')}/recording/stop`,
		},
	};
	const request = requestMap[operation];

	if (!request) {
		throw new Error(`Unsupported call operation: ${operation}`);
	}

	return createJsonRequest(credentials, request.method, request.url, body as IDataObject | undefined, qs);
}

async function executeDownloadRecording(
	context: IExecuteFunctions,
	credentials: CodeChatCredentials,
	itemIndex: number,
): Promise<INodeExecutionData> {
	const callId = context.getNodeParameter('callId', itemIndex) as string;
	const downloadType = context.getNodeParameter('downloadType', itemIndex) as DownloadType;
	const recordingId =
		downloadType === 'recording'
			? (context.getNodeParameter('recordingId', itemIndex) as string)
			: '';
	const fileName = context.getNodeParameter('fileName', itemIndex) as string;
	const outputBinaryPropertyName = context.getNodeParameter(
		'outputBinaryPropertyName',
		itemIndex,
	) as string;
	const responseData = (await context.helpers.httpRequestWithAuthentication.call(
		context,
		'codeChatApi',
		{
			method: 'GET',
			baseURL: getBaseUrl(credentials),
			url: getDownloadUrl(credentials, callId, downloadType, recordingId),
			headers: {
				Accept:
					downloadType === 'recording'
						? 'application/octet-stream'
						: downloadType === 'audio'
							? 'audio/wav'
							: 'video/mp4',
			},
			encoding: 'arraybuffer',
			json: false,
		},
	)) as ArrayBuffer | Buffer;
	const binaryBuffer = Buffer.isBuffer(responseData) ? responseData : Buffer.from(responseData);
	const defaultFileName =
		downloadType === 'recording' ? 'call-recording' : downloadType === 'audio' ? 'call.wav' : 'call.mp4';
	const binaryData = await context.helpers.prepareBinaryData(
		binaryBuffer,
		fileName || defaultFileName,
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

export async function executeCall(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as CallOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);

			if (operation === 'downloadRecording') {
				returnData.push(await executeDownloadRecording(this, credentials, itemIndex));
				continue;
			}

			const callId =
				operation === 'get' ||
				operation === 'hangup' ||
				operation === 'playAudio' ||
				operation === 'reject' ||
				operation === 'startRecording' ||
				operation === 'stopAudio' ||
				operation === 'stopRecording'
					? (this.getNodeParameter('callId', itemIndex) as string)
					: undefined;
			const body =
				operation === 'start'
					? createStartBody(this, itemIndex)
					: operation === 'hangup' || operation === 'reject' || operation === 'stopRecording'
						? createReasonBody(this, itemIndex)
						: operation === 'startRecording'
							? createStartRecordingBody(this, itemIndex)
							: operation === 'playAudio'
								? await createPlayAudioBody(this, itemIndex)
								: undefined;
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				createRequestOptions(
					credentials,
					operation,
					callId,
					body,
					operation === 'list' ? createListQuery(this, itemIndex) : undefined,
				),
			)) as IDataObject | undefined;

			returnData.push({
				json: responseData ?? { success: true },
				pairedItem: { item: itemIndex },
			});
		} catch (error) {
			returnData.push(handleCodeChatError(this, error, itemIndex));
		}
	}

	return [returnData];
}
