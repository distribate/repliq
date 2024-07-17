'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadModel } from '../../../queries/get-thread.ts';

export async function getCurrentThread({
  id: thread_id
}: Pick<ThreadModel, 'id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads')
  .select('title, description, comments, permission')
  .eq('id', thread_id)
  .single();
  
  if (error) throw new Error(error.message);
  
  return data;
}