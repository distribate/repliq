"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export async function getSearchUsers(
	searchedValue: string
) {
	const supabase = createClient()
	
	let query = supabase
	.from('users')
	.select("nickname, name_color");
	
	if (searchedValue.length >= 3) {
		return query.textSearch('nickname', `'${searchedValue}'`, {
			type: 'plain',
			config: "english"
		})
	}
	
	return query.like("nickname", `%${searchedValue}%`)
}