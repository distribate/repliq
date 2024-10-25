"use server"

import "server-only"
import { PostThread } from './post-thread.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type PostThreadImages = PostThread & { paths: string[] }

export async function postThreadImages({
  thread_id, paths
}: PostThreadImages) {
  if (!thread_id || !paths) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_images')
  .insert({
    thread_id: thread_id, images: paths
  })
  .select()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}