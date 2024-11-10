'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { THREADS_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';

type ThreadImages = Pick<ThreadEntity, "id">

export async function getThreadsImages(threadId: ThreadImages["id"]): Promise<Array<string> | null> {
  let images: string[] | null = []
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', threadId)
  .single()
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (data.images) {
    for (let i = 0; i < data.images.length; i++) {
      const { data: urls } = api
      .storage
      .from(THREADS_IMAGES_BUCKET)
      .getPublicUrl(data.images[i]);
      
      images.push(urls.publicUrl)
    }
  } else {
    images = null;
  }
  
  return images;
}