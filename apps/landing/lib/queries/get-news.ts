"use server"

import { Tables } from "@repo/types/entities/gen-supabase";
import { createClient } from '@repo/lib/utils/api/supabase-client';

export type News = Tables<"landing_news">

export type NewsDetailsType = Partial<{
	limit: number,
	range: number[],
	sort: "newest" | "oldest"
}>

type GetImagesFromStorageType = {
	folder: string,
	fileName: string[]
}

async function getImagesCreateSignedUrls({
	folder, fileName
}: GetImagesFromStorageType) {
	const api = createClient();
	
	const fileNamesArray = Array.isArray(fileName) ? fileName : [fileName];
	const filePaths = fileNamesArray.map(name => name);
	
	const { data, error } = await api
	.storage
	.from(folder)
	.createSignedUrls(filePaths, 120)
	
	if (error) {
		throw new Error(error.message)
	}
	
	return data?.map(item => item.signedUrl);
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
	
	const { data, error } = await query.returns<News[]>();
	
	if (error) {
		throw new Error(error.message)
	}
	
	const filteredData = data.filter(
		item => item.images && item.images.length > 0
	) ;
	
	const imagesFromData = await Promise.all(
		filteredData.map(async (item) => {
			return await getImagesCreateSignedUrls({
				fileName: item.images || [],
				folder: "news",
			});
		})
	);
	
	const news = data.map((item, index) => ({
		...item,
		images: item.images && item.images.length > 0 ? imagesFromData[index] : null,
	}))
	
	return news ?? null;
}