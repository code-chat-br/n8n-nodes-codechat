import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import { createJsonRequest, getInstancePath, handleCodeChatError } from '../shared';

type InstanceOperation = 'connectCode' | 'connectQr' | 'get' | 'getConnectionStatus' | 'logout';

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: InstanceOperation,
	body?: IDataObject,
) {
	const instancePath = getInstancePath(credentials);

	const requestMap: Record<
		InstanceOperation,
		{
			method: 'DELETE' | 'GET' | 'POST';
			url: string;
		}
	> = {
		connectCode: {
			method: 'POST',
			url: `${instancePath}/connect/code`,
		},
		connectQr: {
			method: 'GET',
			url: `${instancePath}/connect`,
		},
		get: {
			method: 'GET',
			url: instancePath,
		},
		getConnectionStatus: {
			method: 'GET',
			url: `${instancePath}/connection/status`,
		},
		logout: {
			method: 'DELETE',
			url: `${instancePath}/logout`,
		},
	};
	const request = requestMap[operation];

	return createJsonRequest(credentials, request.method, request.url, body);
}

export async function executeInstance(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as InstanceOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);
			const body =
				operation === 'connectCode'
					? {
							phoneNumber: this.getNodeParameter('phoneNumber', itemIndex) as string,
						}
					: undefined;
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				createRequestOptions(credentials, operation, body),
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
