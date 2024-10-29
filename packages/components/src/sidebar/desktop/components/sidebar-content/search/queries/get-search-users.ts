"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { SearchTypes } from '../types/search-types.ts';

type GetSearchUsers = Pick<SearchTypes, "searchedValue"> & {
	limit?: number,
	range?: Array<number>,
}

export async function getSearchUsers({
	searchedValue, range, limit
}: GetSearchUsers) {
	const api = createClient()
	
	let query = api
	.from('users')
	.select("nickname, name_color")
	
	if (searchedValue.length >= 3) {
		query.textSearch('nickname', `'${searchedValue}'`, {
			type: 'plain',
			config: "english"
		})
	}
	
	query.like("nickname", `%${searchedValue}%`)
	
	if (range) query.range(range[0], range[1])
	if (limit) query.limit(limit)
	
	const { data: searchedUsers, error } = await query;
	
	if (error){
		throw new Error(error.message)
	}
	
	return searchedUsers;
}