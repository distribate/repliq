"use server"

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getThread(
  threadId: Pick<ThreadRequest, 'thread_id'>['thread_id'],
) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads')
  .select()
  .eq('id', threadId)
  
  if (error) return null;
  
  return data;
}