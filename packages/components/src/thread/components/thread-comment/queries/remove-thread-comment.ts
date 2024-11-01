'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { ThreadCommentControlType } from '../types/thread-comment-types.ts';

export async function removeThreadComment({
  commentId, threadId
}: ThreadCommentControlType) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_ref')
  .delete()
  .eq('thread_id', threadId)
  .eq("comment_id", commentId)
  .select()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}