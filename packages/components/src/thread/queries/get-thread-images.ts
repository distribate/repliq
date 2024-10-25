"use server"

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type ThreadImages = {
  thread_id: string
}

export async function getThreadImagesCount(
  thread_id: Pick<ThreadRequest, 'thread_id'>["thread_id"]
) {
  const api = createClient();
  
  const { count, error } = await api
  .from('threads_images')
  .select('images', { count: 'exact', })
  .eq('thread_id', thread_id);
  
  if (error) return null;
  
  return count;
}

export async function getThreadsImages({
  thread_id
}: ThreadImages) {
  if (!thread_id) return;
  
  let images: string[] = []
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_images')
  .select('images')
  .eq('thread_id', thread_id);
  
  if (error) throw new Error(error.message);
  
  if (data[0].images.length) {
    const { data: signedUrls, error } = await api
    .storage
    .from('threads')
    .createSignedUrls(data[0].images, 600);
    
    if (error) {
      throw new Error(error.message);
    }
    
    images = signedUrls.map(item => item.signedUrl);
  }
  
  return images;
}