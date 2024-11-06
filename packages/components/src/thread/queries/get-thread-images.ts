'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type ThreadImages = Pick<ThreadEntity, "id">

export async function getThreadsImages(id: ThreadImages["id"]): Promise<string[] | null> {
  if (!id) return null;
  
  let images: string[] | null = [];
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', id)
  .single()
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (data.images) {
    for (let i = 0; i < data.images.length; i++) {
      const { data: urls } = api
      .storage
      .from('threads')
      .getPublicUrl(data.images[i]);
      
      images.push(urls.publicUrl)
    }
  }
  
  return images;
}