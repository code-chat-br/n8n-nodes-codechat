import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import {
	createJsonRequest,
	getInstancePath,
	handleCodeChatError,
	parseStringList,
	removeEmptyFields,
} from '../shared';

type GroupOperation =
	| 'create'
	| 'getInviteCode'
	| 'leave'
	| 'revokeInviteCode'
	| 'updateParticipants'
	| 'updatePicture';

function createBody(
	context: IExecuteFunctions,
	operation: GroupOperation,
	itemIndex: number,
): IDataObject | undefined {
	if (operation === 'create') {
		return removeEmptyFields({
			subject: context.getNodeParameter('subject', itemIndex) as string,
			description: context.getNodeParameter('description', itemIndex) as string,
			participants: parseStringList(
				context,
				context.getNodeParameter('participants', itemIndex) as string,
				'Participants',
				itemIndex,
			),
		});
	}

	if (operation === 'updateParticipants') {
		return {
			action: context.getNodeParameter('participantAction', itemIndex) as string,
			participants: parseStringList(
				context,
				context.getNodeParameter('participants', itemIndex) as string,
				'Participants',
				itemIndex,
			),
		};
	}

	if (operation === 'updatePicture') {
		return {
			groupJid: context.getNodeParameter('groupJid', itemIndex) as string,
			image: context.getNodeParameter('imageUrl', itemIndex) as string,
		};
	}

	return undefined;
}

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: GroupOperation,
	body?: IDataObject,
	groupJid?: string,
) {
	const instancePath = getInstancePath(credentials);
	const requestMap: Record<
		GroupOperation,
		{
			method: 'DELETE' | 'GET' | 'POST' | 'PUT';
			url: string;
			qs?: IDataObject;
		}
	> = {
		create: {
			method: 'POST',
			url: `${instancePath}/group`,
		},
		getInviteCode: {
			method: 'GET',
			url: `${instancePath}/group/invitation-code`,
			qs: {
				groupJid,
			},
		},
		leave: {
			method: 'DELETE',
			url: `${instancePath}/group/leave`,
			qs: {
				groupJid,
			},
		},
		revokeInviteCode: {
			method: 'PUT',
			url: `${instancePath}/group/revoke-invitation`,
			qs: {
				groupJid,
			},
		},
		updateParticipants: {
			method: 'PUT',
			url: `${instancePath}/group/update-participants`,
			qs: {
				groupJid,
			},
		},
		updatePicture: {
			method: 'PUT',
			url: `${instancePath}/group/update-picture`,
		},
	};
	const request = requestMap[operation];

	return createJsonRequest(credentials, request.method, request.url, body, request.qs);
}

export async function executeGroup(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as GroupOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);
			const groupJid =
				operation === 'getInviteCode' ||
				operation === 'leave' ||
				operation === 'revokeInviteCode' ||
				operation === 'updateParticipants'
					? (this.getNodeParameter('groupJid', itemIndex) as string)
					: undefined;
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				createRequestOptions(
					credentials,
					operation,
					createBody(this, operation, itemIndex),
					groupJid,
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
