import { IExecuteSingleFunctions, IHttpRequestOptions, NodeApiError } from 'n8n-workflow';

function join(...paths: string[]) {
	let url = '/';
	paths.forEach((path) => (url += `${path}/`));
	return url;
}

export function shippingURL(...paths: string[]) {
	return join('{{$credencials.instanceName}}', ...paths, '{{$credencials.licenseKey}}');
}

export async function formatNumber(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const numbers = (this.getNodeParameter('listPhoneNumbers') as string[]).map((number) =>
		number.replace(/[\-\(\)\ ]+/gm, ''),
	);

	if (!requestOptions?.body) requestOptions.body = {};
	Object.assign(requestOptions.body, numbers);

	return requestOptions;
}

export async function sendTextMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	if (!Array.isArray(body.number)) {
		throw new NodeApiError(
			this.getNode(),
			{ error: 'The listPhoneNumbers parameter must be an array' },
			{ message: 'Bad Request', httpCode: '400' },
		);
	}

	const options = body.options;
	Object.assign(options, { quoted: { messageId: options.quoted } });

	requestOptions.body = {
		numbers: body.numbers,
		options,
		textMessage: { text: (body.text as string).trim() },
	};

	return requestOptions;
}
