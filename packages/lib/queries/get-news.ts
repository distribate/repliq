"use server"

import { Tables } from "@repo/types/entities/gen-supabase";
import { createClient } from '@repo/shared/api/supabase-client';

export type News = Tables<"landing_news">

export type NewsDetailsType = Partial<{
	limit: number,
	range: number[],
	sort: "newest" | "oldest"
}>

function getNewsImage(path: string) {
	const api = createClient();
	
	const { data } = api
	.storage
	.from("static")
	.getPublicUrl(path)
	
	return data.publicUrl
}

export async function getNews(details?: NewsDetailsType): Promise<News[] | null> {
	const api = createClient();
	
	let query = api.from("landing_news").select()
	
	const range = details?.range;
	const limit = details?.limit;
	const sort = details?.sort;
	
	if (range) query = query.range(range[0], range[1]);
	if (limit) query = query.limit(limit);
	if (sort) query = query.order("created_at", { ascending: sort === "oldest" });
	
	const { data, error } = await query.returns<News[] | null>();
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data?.map(item => {
		const image = getNewsImage(item.imageUrl)
		
		return {
			...item,
			imageUrl: image
		}
	}) ?? null
}