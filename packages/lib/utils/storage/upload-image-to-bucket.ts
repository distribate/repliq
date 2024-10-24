"use client"

import { createClient } from "../supabase/client.ts";
import {
	deletePrevImageFromUsers
} from "@repo/components/src/profile/components/cover/components/cover-image/hooks/delete-prev-image.ts";

type UploadProperties = {
	bucket: string,
	folderName?: string | null,
	fileName: string,
	file: File | null
}

export type DeleteProperties = {
	userId: string,
	bucket: string
}

export async function deleteImageFromBucket({
	userId, bucket
}: DeleteProperties) {
	const supabase = createClient()
	
	const coverImageUrl = await deletePrevImageFromUsers({ userId })
	
	if (coverImageUrl) {
		const { data, error } = await supabase
		.storage
		.from(bucket)
		.remove([ coverImageUrl ])
		
		if (error) return false;
		if (data) return true;
	}
}

export async function uploadImageToBucket({
	bucket, fileName, file, folderName
}: UploadProperties): Promise<{ path?: string, error?: Error }> {
	const supabase = createClient()
	
	if (!file) return {
		error: new Error("Изображение не выбрано!")
	};
	
	const folderPath = folderName ? folderName + '/' + fileName : fileName;
	
	const { data, error } = await supabase
	.storage
	.from(bucket)
	.upload(folderPath, file, {
		cacheControl: '0', upsert: true
	})
	
	if (error) return {
		error
	};
	
	const path = data.path
	
	return { path };
}