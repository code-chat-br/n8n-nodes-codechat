import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CodeChatUserApi implements ICredentialType {
	name = 'codeChatUserApi';

	displayName = 'CodeChat User API';

	icon: Icon = {
		light: 'file:../icons/codechat.svg',
		dark: 'file:../icons/codechat.dark.svg',
	};

	documentationUrl = 'https://docs.codechat.dev/docs/websocket';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.codechat.dev',
			required: true,
			placeholder: 'https://api.example.com',
		},
		{
			displayName: 'User Token',
			name: 'userToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'User JWT used by CodeChat global WebSocket events',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.userToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '=/ws/global/events?event=message.batch.progress&token={{$credentials.userToken}}',
			method: 'GET',
		},
		rules: [
			{
				type: 'responseCode',
				properties: {
					value: 426,
					message: 'CodeChat global WebSocket endpoint is reachable.',
				},
			},
		],
	};
}
