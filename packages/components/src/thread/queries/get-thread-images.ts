'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';

type ThreadImages = {
  thread_id: string
}

export async function getThreadsImages({
  thread_id,
}: ThreadImages): Promise<string[] | null> {
  if (!thread_id) return null;
  
  let images: string[] | null = [];
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id)
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