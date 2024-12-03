'use server';

import { createClient } from '#utils/api/supabase-client.ts';
import { decode } from 'base64-arraybuffer';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';
import { getCurrentSession } from '#actions/get-current-session.ts';

type UploadProperties = {
  bucket: string,
  folderName?: string | null,
  fileName: string,
  file: string
}

type UploadImageToBucket = {
  path: string | null,
  error: Error | null
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

export async function deleteCoverImageFromBucket(): Promise<boolean> {
  const { user: currentUser } = await getCurrentSession()
  if (!currentUser) return false;
  
  const api = createClient();
  
  const { data, error } = await api
  .from("users")
  .select("cover_image")
  .eq("nickname", currentUser.nickname)
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  const currentCoverImage = data.cover_image;
  
  if (!currentCoverImage) {
    return true;
  }
  
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

export async function uploadCoverImageInBucket({
  bucket, fileName, file, folderName,
}: UploadProperties): Promise<UploadImageToBucket> {
  await deleteCoverImageFromBucket();
  
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