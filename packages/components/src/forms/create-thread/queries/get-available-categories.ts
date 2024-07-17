"use server"

import { createClient } from "@repo/lib/utils/supabase/server.ts";

export async function getAvailableCategories() {
	const supabase = createClient();
	
	const { data, error } = await supabase
		.from("category")
		.select("id, title, description")
		.eq("available", true)

	if (error) {
		console.error(error)
		throw new Error(error.message)
	}
	
	return data;
}