'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { THREAD } from '@repo/types/entities/entities-type.ts';

export async function getCurrentThread({
  id: threadId
}: Pick<ThreadModel, 'id'>): Promise<THREAD> {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads')
  .select('title, description, comments, permission')
  .eq('id', threadId)
  .returns<THREAD[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
}