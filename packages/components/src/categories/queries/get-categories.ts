import { createClient } from "@repo/lib/utils/supabase/server.ts";
import { CATEGORY } from "@repo/types/entities/entities-type.ts"

export async function getCategories() {
	const supabase = createClient();
	
	let query = supabase
	.from("category")
	.select()
	.returns<CATEGORY[]>()
	
	const { data, error } = await query;
	
	if (error) throw error;
	
	return data;
}