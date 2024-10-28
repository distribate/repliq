'use server';

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

type ThreadImages = {
  thread_id: string
}

export async function getThreadImagesCount(
  thread_id: Pick<ThreadRequest, 'thread_id'>['thread_id'],
) {
  const api = createClient();
  
  const { count, error } = await api
  .from('threads_images')
  .select('images', { count: 'exact' })
  .eq('thread_id', thread_id);
  
  if (error) return null;
  
  return count;
}

export async function getThreadsImages({
  thread_id,
}: ThreadImages) {
  if (!thread_id) return;
  
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
    const { data: signedUrls, error } = await api
    .storage
    .from('threads')
    .createSignedUrls(data.images, 60);
    
    if (error) {
      throw new Error(error.message);
    }
    
    images = signedUrls.map(item => item.signedUrl);
  }
  
  return images;
}