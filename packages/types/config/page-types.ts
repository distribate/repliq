export type PageConventionProps = {
	params: {
		id: string,
		nickname: string
	}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

export type MetadataType = {
	params: {
		id?: string,
		title?: string,
		nickname?: string
	}
	searchParams: {
		[key: string]: string | string[] | undefined
	}
}

export type UserPageParam = {
	nickname: string;
	uuid?: string
}