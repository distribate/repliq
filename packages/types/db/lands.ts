interface Role {
	name: string;
	type: number;
	priority: number;
	id: number;
	ulid: string;
	action: string[];
	manage?: string[];
	icon: string;
	taxes: boolean;
	parent: boolean;
}

interface Holder {
	roles: Role[];
	trusted: string[];
}

interface Tax {
	current: number;
	time: number;
	before: number;
}

interface Area {
	ulid: string;
	holder: Holder;
	settings: string[];
	invites: any[];
	tax: Tax;
	banned: any[];
}

export type LandsResponse = {
	ulid: string,
	server: string,
	world: string,
	category: null | string,
	members: Array<{ nickname: string, uuid: string, chunks: number }>,
	created_at: Date,
	area: Area,
	balance: number,
	type: string,
	name: string,
	title: null | string,
	creator: string
}