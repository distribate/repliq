"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { CATEGORY } from '@repo/types/entities/entities-type.ts';
import { RequestOptionsSupabaseClient } from '@repo/types/config/request-types.ts';

export type CategoryModel = {
	threads: boolean,
	title: string,
	id: number
}

type GetCategoryThreadsCount = RequestOptionsSupabaseClient & {
	categoryId: number
}

async function getCategoryThreadsCount({
	categoryId, supabase
}: GetCategoryThreadsCount): Promise<boolean> {
	const { error, count } = await supabase
	.from("category_threads")
	.select("thread_id", { count: "exact"})
	.eq("category_id", categoryId)
	
	if (error) return false;
	if (!count) return false;
	
	return count >= 1
}

export async function getCategories(): Promise<CategoryModel[]> {
	const supabase = createClient();
	
	const { data, error } = await supabase
	.from("category")
	.select()
	.returns<CATEGORY[]>()
	
	if (error) throw new Error(error.message);

	return await Promise.all(data.map(async(category) => {
		const hasThreads = await getCategoryThreadsCount({
			categoryId: category.id, supabase
		});
		
		return {
			id: category.id,
			title: category.title,
			threads: hasThreads
		};
	}))
}