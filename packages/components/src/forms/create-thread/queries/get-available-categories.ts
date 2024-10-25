"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getAvailableCategories() {
	const api = createClient();
	
	const { data, error } = await api
		.from("category")
		.select("id, title, description")
		.eq("available", true)

	if (error) {
		console.error(error)
		throw new Error(error.message)
	}
	
	return data;
}