"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/server.ts';
import { decode } from 'base64-arraybuffer';
import { nanoid } from 'nanoid';
import { THREADS_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';

export type PostThreadImages = {
  thread_id: string
  base64Files: Array<string>
}

type UploadThreadImage = Pick<PostThreadImages, "thread_id"> & {
  base64File: string,
}

async function uploadThreadImage({
  base64File, thread_id
}: UploadThreadImage) {
  const api = createClient()
  
  const decodedFile = decode(base64File)
  const randomFileNameId = nanoid(2);
  const fileName = `${thread_id}-${randomFileNameId}`;
  
  const { data, error } = await api
  .storage
  .from(THREADS_IMAGES_BUCKET)
  .upload(fileName, decodedFile, {
    contentType: "image/png"
  });
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}

export async function postThreadImages({
  thread_id, base64Files
}: PostThreadImages) {
  let uploadedFiles: Array<string> | null = [];
  
  const api = createClient()
  
  for(let i = 0; i < base64Files.length; i++) {
    const uploaded = await uploadThreadImage({
      base64File: base64Files[i], thread_id
    })
    
    if (!uploaded) return;
    
    uploadedFiles.push(uploaded.path)
  }
  
  if (!uploadedFiles) return;
  
  const { data, error } = await api
  .from('threads_images')
  .insert({ thread_id, images: uploadedFiles })
  .select()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}