'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadModel } from '../../../queries/get-thread-model.ts';

export async function getCurrentThread({
  id: threadId
}: Pick<ThreadModel, 'id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads')
  .select('title, description, comments, permission')
  .eq('id', threadId)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}