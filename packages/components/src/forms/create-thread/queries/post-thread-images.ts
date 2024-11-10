"use server"

import "server-only"
import { PostThread } from './post-thread.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { decode } from 'base64-arraybuffer';
import { nanoid } from 'nanoid';
import { THREADS_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';

type PostThreadImages = PostThread & {
  base64Files: string[]
}

type UploadThreadImage = {
  base64File: string,
  threadId: string
}

async function uploadThreadImage({
  base64File, threadId
}: UploadThreadImage) {
  const api = createClient()
  
  const decodedFile = decode(base64File)
  const randomFileNameId = nanoid(2);
  const fileName = `${threadId}-${randomFileNameId}`;
  
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
  if (!thread_id || !base64Files) return;
  
  const api = createClient();
  let uploadedFiles: Array<string> | null = [];
  
  for(let i = 0; i < base64Files.length; i++) {
    const uploaded = await uploadThreadImage({
      base64File: base64Files[i], threadId: thread_id
    })
    
    if (!uploaded) return;
    
    uploadedFiles.push(uploaded.path)
  }
  
  if (!uploadedFiles) return;
  
  const { data, error } = await api
  .from('threads_images')
  .insert({
    thread_id: thread_id,
    images: uploadedFiles
  })
  .select()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}