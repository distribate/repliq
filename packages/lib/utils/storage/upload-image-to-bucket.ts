"use server"

import {
	deletePrevImageFromUsers
} from "@repo/components/src/profile/components/cover/components/cover-image/hooks/delete-prev-image.ts";
import { createClient } from "@repo/lib/utils/api/server.ts";
import { decode } from 'base64-arraybuffer';

type UploadProperties = {
	bucket: string,
	folderName?: string | null,
	fileName: string,
	file: string
}

export type DeleteProperties = {
	userId: string,
	bucket: string
}

export async function deleteImageFromBucket({
	userId, bucket
}: DeleteProperties) {
	const api = createClient()
	
	const coverImageUrl = await deletePrevImageFromUsers({ userId })
	
	if (coverImageUrl) {
		const { data, error } = await api
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
	const api = createClient()
	
	const folderPath = folderName ? folderName + '/' + fileName : fileName;
	const decodedFile = decode(file)
	
	const { data, error } = await api
	.storage
	.from(bucket)
	.upload(folderPath, decodedFile, {
		cacheControl: '0',
		upsert: true,
		contentType: "image/png"
	})
	
	if (error) return {
		error
	};
	
	const path = data.path
	
	return { path };
}