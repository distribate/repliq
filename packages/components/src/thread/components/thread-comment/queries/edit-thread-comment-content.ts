"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadCommentControlType } from '../types/thread-comment-types.ts';

export type EditThreadCommentContent = ThreadCommentControlType &  {
  content: string
}

export async function editThreadCommentContent({
  commentId, threadId, content
}: EditThreadCommentContent) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient()
  
  const { data, error } = await api
    .from("threads_comments")
    .update({
      content: content
    })
    .eq("thread_id", threadId)
    .eq("id", commentId)
    .select("id, content, edited")
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data;
}