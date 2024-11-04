'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { decode } from 'base64-arraybuffer';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';

type UploadProperties = {
  bucket: string,
  folderName?: string | null,
  fileName: string,
  file: string
}

function parseString(input: string): {
  beforeSlash: string; afterSlash: string | null
} {
  const parts = input.split('/');
  
  if (parts.length > 1) {
    return {
      beforeSlash: parts[0],
      afterSlash: parts.slice(1).join('/'),
    };
  }
  
  return { beforeSlash: parts[0], afterSlash: null, };
}

type DeleteCoverImageFromBucket = {
  currentCoverImage: string | null
}

export async function deleteCoverImageFromBucket({
  currentCoverImage
}: DeleteCoverImageFromBucket): Promise<boolean> {
  const api = createClient();
  
  if (!currentCoverImage) return true;
  
  const parsedUrl = parseString(currentCoverImage);
  if (!parsedUrl.beforeSlash) return false;
  
  if (parsedUrl.beforeSlash === 'cover') {
    const { data, error } = await api
    .storage
    .from(USER_IMAGES_BUCKET)
    .remove([ currentCoverImage ]);
    
    if (error) {
      return false;
    }
    
    return !!data;
  } else if (parsedUrl.beforeSlash === 'default') {
    return true;
  }
  
  return false;
}

type UploadImageToBucket = {
  path: string | null,
  error: Error | null
}

export async function uploadCoverImageInBucket({
  bucket, fileName, file, folderName,
}: UploadProperties): Promise<UploadImageToBucket> {
  const api = createClient();
  
  const folderPath = folderName ? folderName + '/' + fileName : fileName;
  const decodedFile = decode(file);
  
  const { data, error } = await api
  .storage
  .from(bucket)
  .upload(folderPath, decodedFile, {
    cacheControl: '0', upsert: true, contentType: 'image/png',
  });
  
  if (error) {
    return { path: null, error };
  }
  
  return { error: null, path: data.path };
}