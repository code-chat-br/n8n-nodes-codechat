import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import type { CodeChatCredentials } from '../shared';
import {
	createJsonRequest,
	getInstancePath,
	handleCodeChatError,
	parseNumberList,
	parseStringList,
} from '../shared';

type ChatOperation =
	| 'archive'
	| 'checkAccounts'
	| 'deleteMessage'
	| 'editMessage'
	| 'getProfilePicture'
	| 'markRead'
	| 'rejectCall';

function createBody(
	context: IExecuteFunctions,
	operation: ChatOperation,
	itemIndex: number,
): IDataObject | undefined {
	if (operation === 'archive') {
		return {
			archive: context.getNodeParameter('archive', itemIndex) as boolean,
			lastMessage: {
				key: {
					remoteJid: context.getNodeParameter('remoteJid', itemIndex) as string,
					fromMe: context.getNodeParameter('fromMe', itemIndex) as boolean,
					id: context.getNodeParameter('messageId', itemIndex) as string,
				},
			},
		};
	}

	if (operation === 'checkAccounts') {
		return {
			numbers: parseStringList(
				context,
				context.getNodeParameter('numbers', itemIndex) as string,
				'Numbers',
				itemIndex,
			),
		};
	}

	if (operation === 'editMessage') {
		return {
			id: context.getNodeParameter('editMessageId', itemIndex) as string,
			text: context.getNodeParameter('text', itemIndex) as string,
		};
	}

	if (operation === 'getProfilePicture') {
		const recipientType = context.getNodeParameter('recipientType', itemIndex) as string;

		return {
			[recipientType]: context.getNodeParameter('recipient', itemIndex) as string,
		};
	}

	if (operation === 'markRead') {
		const readMessagesMode = context.getNodeParameter('readMessagesMode', itemIndex) as string;

		if (readMessagesMode === 'databaseIds') {
			return {
				ids: parseNumberList(
					context,
					context.getNodeParameter('messageDatabaseIds', itemIndex) as string,
					'Message Database IDs',
					itemIndex,
				),
			};
		}

		return {
			sender: context.getNodeParameter('sender', itemIndex) as string,
			chat: context.getNodeParameter('chat', itemIndex) as string,
			messageIds: parseStringList(
				context,
				context.getNodeParameter('messageIds', itemIndex) as string,
				'Message IDs',
				itemIndex,
			),
		};
	}

	if (operation === 'rejectCall') {
		return {
			callId: context.getNodeParameter('callId', itemIndex) as string,
			callFrom: context.getNodeParameter('callFrom', itemIndex) as string,
		};
	}

	return undefined;
}

function createRequestOptions(
	credentials: CodeChatCredentials,
	operation: ChatOperation,
	body?: IDataObject,
	messageDatabaseId?: number,
) {
	const instancePath = getInstancePath(credentials);
	const requestMap: Record<
		ChatOperation,
		{
			method: 'DELETE' | 'PATCH' | 'POST' | 'PUT';
			url: string;
			qs?: IDataObject;
		}
	> = {
		archive: {
			method: 'PUT',
			url: `${instancePath}/chat/archive`,
		},
		checkAccounts: {
			method: 'POST',
			url: `${instancePath}/chat/is-account`,
		},
		deleteMessage: {
			method: 'DELETE',
			url: `${instancePath}/chat/delete-message`,
			qs: {
				id: messageDatabaseId,
			},
		},
		editMessage: {
			method: 'POST',
			url: `${instancePath}/chat/edit-message`,
		},
		getProfilePicture: {
			method: 'POST',
			url: `${instancePath}/chat/profile-picture`,
		},
		markRead: {
			method: 'PATCH',
			url: `${instancePath}/chat/read-message`,
		},
		rejectCall: {
			method: 'POST',
			url: `${instancePath}/chat/reject-call`,
		},
	};
	const request = requestMap[operation];

	return createJsonRequest(credentials, request.method, request.url, body, request.qs);
}

export async function executeChat(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
		try {
			const operation = this.getNodeParameter('operation', itemIndex) as ChatOperation;
			const credentials = await this.getCredentials<CodeChatCredentials>('codeChatApi', itemIndex);
			const messageDatabaseId =
				operation === 'deleteMessage'
					? (this.getNodeParameter('messageDatabaseId', itemIndex) as number)
					: undefined;
			const responseData = (await this.helpers.httpRequestWithAuthentication.call(
				this,
				'codeChatApi',
				createRequestOptions(
					credentials,
					operation,
					createBody(this, operation, itemIndex),
					messageDatabaseId,
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
