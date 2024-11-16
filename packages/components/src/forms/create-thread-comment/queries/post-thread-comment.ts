'use server';

import "server-only"
import { ThreadCommentEntity, ThreadCommentRepliedEntity } from '@repo/types/entities/entities-type.ts';
import { CreateThreadCommentType } from './create-thread-comment-query.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function postThreadReplied({
  initiator_comment_id, recipient_comment_id,
}: Omit<ThreadCommentRepliedEntity, 'id' | 'created_at'>) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_replies')
  .insert({
    initiator_comment_id,
    recipient_comment_id,
  })
  .select('initiator_comment_id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadCommentItem({
  user_nickname, content, thread_id
}: Pick<ThreadCommentEntity, 'content' | 'user_nickname' | "thread_id">) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .insert({
    user_nickname, content, thread_id
  })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

type PostThreadComment = Pick<ThreadCommentEntity,
  'thread_id' | "content" | "user_nickname"> & {
  type: CreateThreadCommentType,
  recipient_comment_id?: Pick<ThreadCommentRepliedEntity, "recipient_comment_id">["recipient_comment_id"]
}

export async function postThreadComment({
  thread_id, content, user_nickname, type = 'single', recipient_comment_id,
}: PostThreadComment) {
  if (!thread_id || !content || !user_nickname) return;
  
  const api = createClient();
  
  const { data, error } = await api
    .from("threads")
    .select("isComments")
    .eq("id", thread_id)
    .single()
  
  if (error || !data) {
    throw new Error(error.message);
  }
  
  const { id: commentItemId } = await postThreadCommentItem({
    user_nickname, content, thread_id
  });
  
  if (!commentItemId) return;
  
  let initiator_comment_id: string | null = null;
  
  if (type === 'reply' && recipient_comment_id) {
    const { initiator_comment_id: replyInitiatorCommentId } = await postThreadReplied({
      initiator_comment_id: commentItemId,
      recipient_comment_id: Number(recipient_comment_id),
    });
    
    if (!replyInitiatorCommentId) return;
    
    initiator_comment_id = replyInitiatorCommentId;
  }
  
  return { initiator_comment_id, comment_id: commentItemId };
}