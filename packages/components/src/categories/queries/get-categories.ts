"use server"

import "server-only"
import { CategoryEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '../../../../lib/utils/api/supabase-client.ts';

export type CategoryModel = {
	hasThreads: boolean,
	title: string,
	id: number
}

type GetCategoryThreadsCount = {
	categoryId: number
}

async function getCategoryThreadsCount({
	categoryId
}: GetCategoryThreadsCount): Promise<boolean> {
	const api = createClient();
	
	const { error, count } = await api
	.from("category_threads")
	.select("thread_id", { count: "exact"})
	.eq("category_id", categoryId)
	
	if (error) return false;
	if (!count) return false;
	
	return count >= 1
}

export async function getCategories(): Promise<CategoryModel[]> {
	const api = createClient();
	
	const { data, error } = await api
	.from("category")
	.select()
	.returns<CategoryEntity[]>()
	
	if (error) {
		throw new Error(error.message);
	}

	return await Promise.all(data.map(async(category) => {
		const hasThreads = await getCategoryThreadsCount({
			categoryId: category.id
		});
		
		return {
			id: category.id,
			title: category.title,
			hasThreads
		};
	}))
}