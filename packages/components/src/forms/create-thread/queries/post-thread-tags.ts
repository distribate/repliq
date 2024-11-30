"use server"

import { createClient } from '../../../../../lib/utils/api/supabase-client.ts';
import { PostThreadProperties } from '#forms/create-thread/queries/post-thread.ts';

export async function postThreadTags({
  ...values
}: Pick<PostThreadProperties, 'id' | 'tags'>) {
  const { tags, id: thread_id } = values;
  if (!tags) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_tags')
  .insert({ thread_id, tags, })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}