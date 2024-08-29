'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

type GetCurrentThread = Tables<"threads">

export async function getCurrentThread({
  id: threadId
}: Pick<ThreadModel, 'id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads')
  .select('title, description, comments, permission')
  .eq('id', threadId)
  .returns<GetCurrentThread[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
}