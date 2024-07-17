"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { PostThread } from './post-thread.ts';

export async function postThreadImages({
  thread_id, paths
}: PostThread & {
  paths: string[]
}) {
  const supabase = createClient();
  
  if (!thread_id || !paths) return;
  
  const { data, error } = await supabase
  .from('threads_images')
  .insert({
    thread_id: thread_id, images: paths
  })
  .select()
  
  if (error) {
    console.error(error.message)
    throw new Error(error.message)
  }
  
  return data;
}