export namespace proto {
	export type IRow = {
		title: string;
		description: string;
		rowId: string;
	};
	export type Isection =
		| {
				title: string;
				rows: IRow[];
		  } & { rowsProperty?: { rows: proto.IRow[] } };
}
