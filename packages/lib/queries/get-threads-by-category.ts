import { createClient } from "../utils/supabase/server.ts";
import { THREAD } from "@repo/types/entities/entities-type.ts"

type ThreadsFromCategoriesProperties = {
	limit: number,
	range: number[]
}

type ThreadsFromCategories = {
	categoryId: string
} & Partial<ThreadsFromCategoriesProperties>

export async function getThreadsCategories({
	categoryId, range, limit = 3
}: ThreadsFromCategories): Promise<THREAD[] | null> {
	const supabase = createClient();
	
	let query = supabase
	.from("category_threads")
	.select("*, threads(*)")
	.eq("category_id", categoryId)
	
	if (limit) {
		query.limit(limit)
	}
	
	if (range) {
		query.range(range[0], range[1])
	}
	
	const { data, error } = await query;
	
	if (error) throw error;
	
	if (!data.length) return null;
	
	return data.map(item => item.threads);
}