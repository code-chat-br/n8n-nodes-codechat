import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CodeChatApi implements ICredentialType {
	name = 'codeChatApi';

	displayName = 'CodeChat API';

	icon: Icon = {
		light: 'file:../icons/codechat.svg',
		dark: 'file:../icons/codechat.dark.svg',
	};

	documentationUrl = 'https://docs.codechat.dev/docs/authentication';

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
			displayName: 'Instance Name',
			name: 'instanceName',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'minha-instancia',
		},
		{
			displayName: 'Instance Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '=/instance/{{$credentials.instanceName}}',
			method: 'GET',
		},
	};
}
