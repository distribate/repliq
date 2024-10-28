"use server"

import { createClient } from "@repo/lib/utils/api/server.ts";
import { DeleteProperties } from "@repo/lib/utils/storage/upload-image-to-bucket.ts";

export async function deletePrevImageFromUsers({
	userId
}: Pick<DeleteProperties, "userId">) {
	const supabase = createClient()
	
	const { data, error } = await supabase
	.from("users")
	.select("cover_image")
	.eq("id", userId)
	.returns<{
		cover_image: string
	}[]>()
	.single()
	
	if (error) throw new Error(error.message)
	
	return data.cover_image;
}