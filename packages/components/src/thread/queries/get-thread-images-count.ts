"use server"

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function getThreadImagesCount(
  thread_id: Pick<ThreadRequest, 'thread_id'>['thread_id'],
): Promise<number | null> {
  const api = createClient();
  
  const { count, error } = await api
  .from('threads_images')
  .select('images', { count: 'exact' })
  .eq('thread_id', thread_id);
  
  if (error) {
    return null;
  }
  
  return count || 0;
}