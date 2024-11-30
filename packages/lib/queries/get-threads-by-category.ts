import { createClient } from "#utils/api/supabase-client.ts";
import { RequestDetails, ThreadEntity } from '@repo/types/entities/entities-type.ts';

type ThreadsFromCategories = {
	categoryId: number
} & RequestDetails

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