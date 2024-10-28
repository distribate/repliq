'use server';

import "server-only"
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getCurrentThread({
  id: threadId
}: Pick<ThreadModel, 'id'>) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .select('id, title, description, comments, permission')
  .eq('id', threadId)
  .returns<ThreadEntity[]>()
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data[0];
}