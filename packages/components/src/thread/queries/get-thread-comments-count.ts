"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

export async function getThreadCommentsCount(
  threadId: Pick<ThreadEntity, 'id'>["id"]
): Promise<number> {
  const api = createClient();
  
  const { error, count } = await api
  .from('threads_comments')
  .select('id', { count: 'exact' })
  .eq('thread_id', threadId);
  
  if (error) {
    return 0;
  }
  
  return count || 0;
}