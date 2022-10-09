import { IExecuteSingleFunctions, IHttpRequestOptions, NodeApiError } from 'n8n-workflow';
import { ICodeChat } from './Codechat';

function isNotempty(value: any) {
	if (!value) return false;
	if (typeof value === 'string' && value === '') return false;
	return true;
}

function join(...paths: string[]) {
	let url = '';
	paths.forEach((path) => (url += `${path}/`));
	console.log({ url });
	return url;
}

export function shippingURL(...paths: string[]) {
	console.log({ paths });
	return join('{{$credentials.instanceName}}', ...paths, '{{$credentials.licenseKey}}');
}

export async function formatNumber(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const numbers = (this.getNodeParameter('listPhoneNumbers') as string[]).map((number) =>
		number.replace(/[\-\(\)\ ]+/gm, ''),
	);

	if (!requestOptions?.body) requestOptions.body = {};
	Object.assign(requestOptions.body, { numbers: [...numbers] });

	return requestOptions;
}

export async function prepareShippingOptions(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	const opts: any = {};
	if (body?.options)
		for (const [key, value] of Object.entries(body.options)) {
			if (isNotempty(value)) {
				if (key === 'quoted') {
					opts[key] = { messageId: value as string };
					continue;
				}
				opts[key] = value as number | string[];
			}
		}

	Object.assign(requestOptions.body as {}, { options: opts });

	return requestOptions;
}

export async function sendTextMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	if (!Array.isArray(body.numbers)) {
		throw new NodeApiError(
			this.getNode(),
			{ error: 'The listPhoneNumbers parameter must be an array' },
			{ message: 'Bad Request', httpCode: '400' },
		);
	}

	Object.assign(requestOptions.body as {}, { textMessage: { text: (body.text as string).trim() } });

	return requestOptions;
}
