import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import {
	createJsonRequest,
	getInstancePath,
	handleCodeChatError,
	removeEmptyFields,
} from '../shared';

type WebhookOperation = 'get' | 'set';

function createBody(context: IExecuteFunctions, itemIndex: number): IDataObject {
	const events = context.getNodeParameter('events', itemIndex, {}) as IDataObject;
	const body: IDataObject = {
		url: context.getNodeParameter('url', itemIndex) as string,
		enabled: context.getNodeParameter('enabled', itemIndex) as boolean,
	};

	if (Object.keys(events).length > 0) {
		body.events = events;
	}

	return removeEmptyFields(body);
}

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: WebhookOperation,
	body?: IDataObject,
) {
	const instancePath = getInstancePath(credentials);

	return createJsonRequest(
		credentials,
		operation === 'set' ? 'PUT' : 'GET',
		`${instancePath}/webhook`,
		body,
	);
}

export async function executeWebhook(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as WebhookOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				createRequestOptions(
					credentials,
					operation,
					operation === 'set' ? createBody(this, itemIndex) : undefined,
				),
			)) as IDataObject;

			returnData.push({
				json: responseData,
				pairedItem: { item: itemIndex },
			});
		} catch (error) {
			returnData.push(handleCodeChatError(this, error, itemIndex));
		}
	}

	return [returnData];
}
