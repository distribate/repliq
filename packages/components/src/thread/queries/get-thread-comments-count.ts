"use server"

import { ThreadRequest } from '../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function getThreadCommentsCount(
  threadId: Pick<ThreadRequest, 'thread_id'>["thread_id"]
) {
  const api = createClient();
  
  const { error, count } = await api
  .from('threads_comments_ref')
  .select('comment_id', { count: 'exact' })
  .eq('thread_id', threadId);
  
  if (error) return null;
  
  return count;
}
