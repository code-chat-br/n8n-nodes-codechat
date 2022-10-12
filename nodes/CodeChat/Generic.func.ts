import {
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	IN8nHttpFullResponse,
	INodeExecutionData,
	NodeApiError,
} from 'n8n-workflow';

export async function sendErrorPostReceive(
	this: IExecuteSingleFunctions,
	data: INodeExecutionData[],
	response: IN8nHttpFullResponse,
): Promise<INodeExecutionData[]> {
	if ((response?.body as any)?.error) {
		const body: any = response.body;
		if (body?.error) {
			throw new NodeApiError(
				this.getNode(),
				{ error: body.error, message: body.message },
				{
					message: 'Check the type of properties and values entered',
					description:
						'Check that there are no undefined values; whether the type of values is as expected or whether mandatory properties have been entered.',
					httpCode: body.statusCode.toString(),
				},
			);
		}
	}
	return data;
}

function isNotempty(value: any) {
	if (!value) return false;
	if (typeof value === 'string' && value === '') return false;
	return true;
}

function join(...paths: string[]) {
	let url = '';
	paths.forEach((path) => (url += `${path}/`));
	return url;
}

export function shippingURL(...paths: string[]) {
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

	if (((requestOptions.body as any).numbers as string[]).length === 0) {
		throw new NodeApiError(
			this.getNode(),
			{
				message: [
					'The listPhoneNumbers parameter must be an array',
					'listPhoneNumbers must have at least one value',
				],
			},
			{
				message: 'Check the type of properties and values entered',
				description: 'Bad Request',
				httpCode: '400',
			},
		);
	}

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

export async function sendButtonsMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	if (body?.mediaData) {
		if (body.mediaData?.type && body.mediaData?.source) {
			body.buttonsMessage.mediaMessage = {
				mediaType: body.mediaData?.type,
				url: body.mediaData?.source,
			};
		}
	}

	const buttonFieldTypeProperty = this.getNodeParameter('buttonFieldTypeProperty');
	if (buttonFieldTypeProperty === 'collection') {
		body.buttonsMessage.buttons = body.buttons.replyButtons;
	}

	delete body.buttons;
	delete body.mediaData;

	Object.assign(requestOptions.body as {}, { ...body });

	return requestOptions;
}

export async function sendTemplateMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	if (body?.mediaData) {
		if (body.mediaData?.type && body.mediaData?.source) {
			body.templateMessage.mediaMessage = {
				mediaType: body.mediaData?.type,
				url: body.mediaData?.source,
			};
		}
	}

	const templateFieldTypeProperty = this.getNodeParameter('templateFieldTypeProperty');
	if (templateFieldTypeProperty === 'collection') {
		body.templateMessage.buttons = body.buttons.templateButtons;
	}

	delete body.buttons;
	delete body.mediaData;

	Object.assign(requestOptions.body as {}, { ...body });

	return requestOptions;
}

export async function sendListMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	const listFieldTypeProperty = this.getNodeParameter('listFieldTypeProperty');

	let sections: any[] | undefined;

	if (listFieldTypeProperty === 'collection') {
		const listMessage = {
			title: body.listMessage.title,
			description: body.listMessage.description,
			footerText: body.listMessage.footerText,
			buttonText: body.listMessage.buttonText,
			sections: (body.listMessage.sections as any[]).map((section) => {
				return {
					title: section.title,
					rows: section.rowsProperty.rows,
				};
			}),
		};

		sections = listMessage.sections;

		Object.assign(requestOptions.body as {}, { listMessage });
	} else {
		sections = body.listMessage?.sections;
	}

	if (
		!Array.isArray(sections) ||
		sections.length === 0 ||
		sections.length !== [...new Set(sections)].length
	) {
		throw new NodeApiError(
			this.getNode(),
			{ error: ['List items must not be empty', 'List items must be unique'] },
			{ message: 'Bad Request', description: 'check properties', httpCode: '400' },
		);
	}

	sections.forEach((section, index) => {
		if (!section?.title) {
			throw new NodeApiError(
				this.getNode(),
				{ error: `Section[${index}].title is empty` },
				{ message: 'Dad Request', description: 'Title cannot be empty', httpCode: '400' },
			);
		}

		if (
			!Array.isArray(section?.rows) ||
			!section.rows?.length ||
			section.rows.length === 0 ||
			[...new Set(section.rows)].length !== section.rows.length
		) {
			throw new NodeApiError(
				this.getNode(),
				{ error: 'Empty list items' },
				{ message: 'Bad Request', description: 'List items cannot be empty', httpCode: '400' },
			);
		}

		if ([...new Set(section.rows)].length !== section.rows.length) {
			throw new NodeApiError(
				this.getNode(),
				{ error: ['List items must not be empty', 'List items must be unique'] },
				{ message: 'Bad Request', description: 'check properties', httpCode: '400' },
			);
		}
	});

	return requestOptions;
}

export async function sendContactMessage(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body = requestOptions.body as any;

	const contactTypeProperty = this.getNodeParameter('contactTypeProperty');
	if (contactTypeProperty === 'collection') {
		Object.assign(requestOptions.body as {}, {
			contactsMessage: [...body.contactMessage.contacts],
		});
	}

	console.log('BODY: ', body);

	return requestOptions;
}
