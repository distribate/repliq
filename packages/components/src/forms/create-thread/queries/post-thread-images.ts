"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { PostThread } from './post-thread.ts';

type PostThreadImages = PostThread & { paths: string[] }

export async function postThreadImages({
  thread_id, paths
}: PostThreadImages) {
  const supabase = createClient();
  
  if (!thread_id || !paths) return;
  
  const { data, error } = await supabase
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