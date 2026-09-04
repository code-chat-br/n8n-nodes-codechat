import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCall = {
	resource: ['call'],
};

const showOnlyForStart = {
	resource: ['call'],
	operation: ['start'],
};

const showOnlyForList = {
	resource: ['call'],
	operation: ['list'],
};

const showOnlyForCallId = {
	resource: ['call'],
	operation: [
		'downloadRecording',
		'get',
		'hangup',
		'playAudio',
		'reject',
		'startRecording',
		'stopAudio',
		'stopRecording',
	],
};

const showOnlyForReason = {
	resource: ['call'],
	operation: ['hangup', 'reject', 'stopRecording'],
};

const showOnlyForPlayAudio = {
	resource: ['call'],
	operation: ['playAudio'],
};

const showOnlyForPlayAudioUrl = {
	resource: ['call'],
	operation: ['playAudio'],
	audioSource: ['url'],
};

const showOnlyForPlayAudioFile = {
	resource: ['call'],
	operation: ['playAudio'],
	audioSource: ['binary'],
};

const showOnlyForStartRecording = {
	resource: ['call'],
	operation: ['startRecording'],
};

const showOnlyForDownloadRecording = {
	resource: ['call'],
	operation: ['downloadRecording'],
};

const showOnlyForDownloadRecordingById = {
	resource: ['call'],
	operation: ['downloadRecording'],
	downloadType: ['recording'],
};

const callStatusOptions = [
	{ name: 'Active', value: 'ACTIVE' },
	{ name: 'Answered Elsewhere', value: 'ANSWERED_ELSEWHERE' },
	{ name: 'Busy', value: 'BUSY' },
	{ name: 'Connecting', value: 'CONNECTING' },
	{ name: 'Ended', value: 'ENDED' },
	{ name: 'Ended Unconfirmed', value: 'ENDED_UNCONFIRMED' },
	{ name: 'Ending', value: 'ENDING' },
	{ name: 'Failed', value: 'FAILED' },
	{ name: 'Group Active', value: 'GROUP_ACTIVE' },
	{ name: 'Group Declined', value: 'GROUP_DECLINED' },
	{ name: 'Group Ended', value: 'GROUP_ENDED' },
	{ name: 'Group Failed', value: 'GROUP_FAILED' },
	{ name: 'Group Interrupted', value: 'GROUP_INTERRUPTED' },
	{ name: 'Group Invited', value: 'GROUP_INVITED' },
	{ name: 'Group Joining', value: 'GROUP_JOINING' },
	{ name: 'Group Leaving', value: 'GROUP_LEAVING' },
	{ name: 'Group Missed', value: 'GROUP_MISSED' },
	{ name: 'Group Reinvited', value: 'GROUP_REINVITED' },
	{ name: 'Group Ringing', value: 'GROUP_RINGING' },
	{ name: 'Group Stale', value: 'GROUP_STALE' },
	{ name: 'Group Waiting Approval', value: 'GROUP_WAITING_APPROVAL' },
	{ name: 'Incoming', value: 'INCOMING' },
	{ name: 'Interrupted', value: 'INTERRUPTED' },
	{ name: 'Missed', value: 'MISSED' },
	{ name: 'Preaccepted', value: 'PREACCEPTED' },
	{ name: 'Rejected', value: 'REJECTED' },
	{ name: 'Rejected Elsewhere', value: 'REJECTED_ELSEWHERE' },
	{ name: 'Ringing', value: 'RINGING' },
	{ name: 'Outgoing', value: 'OUTGOING' },
];

export const callDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCall,
		},
		options: [
			{
				name: 'Download Recording',
				value: 'downloadRecording',
				action: 'Download a call recording',
				description: 'Download the completed recording for a call',
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a call',
				description: 'Get one call by ID',
			},
			{
				name: 'Hang Up',
				value: 'hangup',
				action: 'Hang up a call',
				description: 'Terminate an active call',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List calls',
				description: 'List calls with optional filters',
			},
			{
				name: 'Play Audio',
				value: 'playAudio',
				action: 'Play audio into a call',
				description: 'Send audio into an active call from a URL or binary file',
			},
			{
				name: 'Reject',
				value: 'reject',
				action: 'Reject a call',
				description: 'Reject an inbound call',
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a call',
				description: 'Start an outbound WhatsApp call',
			},
			{
				name: 'Start Recording',
				value: 'startRecording',
				action: 'Start call recording',
				description: 'Start local disk recording for a managed call',
			},
			{
				name: 'Stop Audio',
				value: 'stopAudio',
				action: 'Stop audio playback',
				description: 'Stop audio playback previously started for a call',
			},
			{
				name: 'Stop Recording',
				value: 'stopRecording',
				action: 'Stop call recording',
				description: 'Stop local disk recording for a managed call',
			},
		],
		default: 'start',
	},
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForCallId,
		},
		description: 'Internal call ID',
	},
	{
		displayName: 'Target',
		name: 'target',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForStart,
		},
		placeholder: '5511999999999',
		description: 'Phone number or JID to call',
	},
	{
		displayName: 'Video',
		name: 'video',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForStart,
		},
		description: 'Whether to start a video call',
	},
	{
		displayName: 'External ID',
		name: 'externalId',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForStart,
		},
		description: 'Optional external ID to associate with the call',
	},
	{
		displayName: 'Start Recording',
		name: 'recordingEnabled',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForStart,
		},
		description: 'Whether to request recording when the call starts',
	},
	{
		displayName: 'Record Audio',
		name: 'recordAudio',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['start'],
				recordingEnabled: [true],
			},
		},
		description: 'Whether to record audio when recording starts with the call',
	},
	{
		displayName: 'Record Video',
		name: 'recordVideo',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['start'],
				recordingEnabled: [true],
			},
		},
		description: 'Whether to record video when recording starts with the call',
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForReason,
		},
		description: 'Optional reason to send with the call action',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForList,
		},
		options: [
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'string',
				default: '',
				description: 'Cursor for pagination',
			},
			{
				displayName: 'Direction',
				name: 'direction',
				type: 'options',
				options: [
					{ name: 'Incoming', value: 'incoming' },
					{ name: 'Outgoing', value: 'outgoing' },
				],
				default: 'incoming',
				description: 'Filter by call direction',
			},
			{
				displayName: 'External ID',
				name: 'externalId',
				type: 'string',
				default: '',
				description: 'Filter by external ID',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Peer',
				name: 'peer',
				type: 'string',
				default: '',
				description: 'Filter by peer phone number or JID',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: callStatusOptions,
				default: 'ACTIVE',
				description: 'Filter by call status',
			},
			{
				displayName: 'Video',
				name: 'video',
				type: 'boolean',
				default: false,
				description: 'Whether to filter by calls that have video',
			},
		],
	},
	{
		displayName: 'Audio Source',
		name: 'audioSource',
		type: 'options',
		options: [
			{
				name: 'Binary File',
				value: 'binary',
			},
			{
				name: 'URL',
				value: 'url',
			},
		],
		default: 'url',
		displayOptions: {
			show: showOnlyForPlayAudio,
		},
		description: 'Source of the audio to play into the call',
	},
	{
		displayName: 'Audio URL',
		name: 'audioUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForPlayAudioUrl,
		},
		placeholder: 'https://example.com/audio.wav',
		description: 'HTTP(S) URL of the audio to play',
	},
	{
		displayName: 'Input Binary Field',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForPlayAudioFile,
		},
		description: 'Name of the input binary field containing the audio file',
	},
	{
		displayName: 'Loop',
		name: 'loop',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForPlayAudio,
		},
		description: 'Whether to loop audio playback until stopped',
	},
	{
		displayName: 'Replace Current',
		name: 'replaceCurrent',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnlyForPlayAudio,
		},
		description: 'Whether to stop the current playback before starting this audio',
	},
	{
		displayName: 'Recording Options',
		name: 'recordingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForStartRecording,
		},
		options: [
			{
				displayName: 'Audio',
				name: 'audio',
				type: 'boolean',
				default: true,
				description: 'Whether to record audio',
			},
			{
				displayName: 'Consent At',
				name: 'consentAt',
				type: 'dateTime',
				default: '',
				description: 'When recording consent was granted',
			},
			{
				displayName: 'Consent Granted',
				name: 'consentGranted',
				type: 'boolean',
				default: false,
				description: 'Whether recording consent was granted',
			},
			{
				displayName: 'Incoming Audio',
				name: 'incomingAudio',
				type: 'boolean',
				default: true,
				description: 'Whether to record incoming audio',
			},
			{
				displayName: 'Incoming Video',
				name: 'incomingVideo',
				type: 'boolean',
				default: true,
				description: 'Whether to record incoming video',
			},
			{
				displayName: 'Outgoing Audio',
				name: 'outgoingAudio',
				type: 'boolean',
				default: true,
				description: 'Whether to record outgoing audio',
			},
			{
				displayName: 'Outgoing Video',
				name: 'outgoingVideo',
				type: 'boolean',
				default: true,
				description: 'Whether to record outgoing video',
			},
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Optional reason for starting recording',
			},
			{
				displayName: 'Video',
				name: 'video',
				type: 'boolean',
				default: false,
				description: 'Whether to record video',
			},
		],
	},
	{
		displayName: 'Download Type',
		name: 'downloadType',
		type: 'options',
		options: [
			{
				name: 'Completed Recording by ID',
				value: 'recording',
			},
			{
				name: 'Unified Audio',
				value: 'audio',
			},
			{
				name: 'Unified Incoming Video',
				value: 'incomingVideo',
			},
			{
				name: 'Unified Outgoing Video',
				value: 'outgoingVideo',
			},
		],
		default: 'recording',
		displayOptions: {
			show: showOnlyForDownloadRecording,
		},
		description: 'Which completed call recording file to download',
	},
	{
		displayName: 'Recording ID',
		name: 'recordingId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadRecordingById,
		},
		description: 'Recording ID to download',
	},
	{
		displayName: 'Output Binary Field',
		name: 'outputBinaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyForDownloadRecording,
		},
		description: 'Name of the binary field to write the downloaded recording to',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyForDownloadRecording,
		},
		description: 'Optional file name for the downloaded recording',
	},
];
