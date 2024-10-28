"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";

type ImageUrlProperties = {
	bucket: string,
	fileName: string | null
}

export async function getImageUrl({
	bucket, fileName
}: ImageUrlProperties): Promise<string | null> {
	const supabase = createClient()
	
	if (!fileName) return null;
	
	const { data: url, error } = await supabase
	.storage
	.from(bucket)
	.createSignedUrl(fileName, 600)
	
	if (error) return null;
	
	return url.signedUrl;
}