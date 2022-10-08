import { IAuthenticateGeneric, ICredentialType, INodeProperties } from 'n8n-workflow';

export class CodeChatCredentialsApi implements ICredentialType {
	name = 'codeChatApi';
	displayName = 'CodeChat Api';
	properties: INodeProperties[] = [
		{
			displayName: 'Instance Name',
			name: 'instanceName',
			type: 'string',
			default: '',
			required: true,
			description: 'Name of the instance informed in the registration',
		},

		{
			displayName: 'License Key',
			name: 'licenseKey',
			type: 'string',
			default: '',
			required: true,
			description: 'System generated license code',
		},

		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: '',
			placeholder: 'https://api.codechat.rest',
			hint: 'Inform the url provided by your service provider',
		},
	];
	documentationUrl = 'CodeChat';
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				instanceName: '={{$credentials.instanceName}}',
				licenseKey: '={{$credentials.licenseKey}}',
				baseUrl: '={{$credentials.baseUrl',
			},
		},
	};
	genericAuth = true;
}
