export namespace ICodeChat {
	export type IOptionsMessage = {
		quoted?: string | { messageId: string };
		mentioned?: string[];
		delay?: number;
	};
}
