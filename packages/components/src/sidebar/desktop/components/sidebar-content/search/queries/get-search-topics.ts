"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { SearchTypes } from '../types/search-types.ts';

export async function getSearchTopics({
	searchedValue, range, limit
}: SearchTypes) {
	const api = createClient()
	
	let query = api
	.from('threads')
	.select("title, id")
	.ilike('title', `%${searchedValue}%`)

	if (limit) query.limit(limit);
	
	if (range && range.length === 2) query.range(
		range[0], range[1]
	);
	
	const { data: searchedThreads, error } = await query;
	
	if (error) {
		throw new Error(error.message)
	}
	
	return searchedThreads;
}