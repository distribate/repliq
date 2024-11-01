import { createClient } from "@repo/lib/utils/api/server.ts";
import { ThreadEntity } from "@repo/types/entities/entities-type.ts"

type ThreadsFromCategoriesProperties = {
	limit: number,
	range: number[]
}

type ThreadsFromCategories = {
	categoryId: string
} & Partial<ThreadsFromCategoriesProperties>

export async function getThreadsCategories({
	categoryId, range, limit = 3
}: ThreadsFromCategories): Promise<ThreadEntity[] | null> {
	const api = createClient();
	
	let query = api
	.from("category_threads")
	.select("*, threads(*)")
	.eq("category_id", categoryId)
	
	if (limit) query.limit(limit)
	if (range) query.range(range[0], range[1])
	
	const { data, error } = await query;
	
	if (error) {
		throw new Error(error.message);
	}
	
	if (!data.length) return null;
	
	return data.map(item => item.threads);
}