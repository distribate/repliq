"use server"

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

export async function getThread(
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id'],
): Promise<ThreadEntity | null> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .select()
  .eq('id', threadId)
  .single()
  
  if (error) {
    return null;
  }
  
  return data;
}