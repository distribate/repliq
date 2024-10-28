"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';

type SearchTopics = {
	searchedValue: string,
	limit?: number,
	range?: number[]
}

export async function getSearchTopics({
	searchedValue, range, limit
}: SearchTopics) {
	const supabase = createClient()
	
	let query = supabase
	.from('threads')
	.select("title, id")
	.ilike('title', `%${searchedValue}%`)

	if (limit) return query.limit(limit);
	
	if (range && range.length === 2) return query.range(
		range[0], range[1]
	);
	
	return query;
}