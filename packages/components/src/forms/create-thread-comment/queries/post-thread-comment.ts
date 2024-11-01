'use server';

import "server-only"
import { ThreadCommentEntity, ThreadCommentEntityRef, ThreadCommentRepliedEntity } from '@repo/types/entities/entities-type.ts';
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

export async function postThreadCommentThreads({
  comment_id, thread_id,
}: Pick<ThreadCommentEntityRef, 'thread_id' | 'comment_id'>) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_ref')
  .insert({
    comment_id, thread_id,
  })
  .select('comment_id')
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
    .select("comments")
    .eq("id", thread_id)
    .single()
  
  if (error || !data) {
    throw new Error(error.message);
  }
  
  const { id: threadCommentItemId } = await postThreadCommentItem({
    user_nickname, content, thread_id
  });
  
  if (!threadCommentItemId) return;
  
  let initiator_comment_id: string | null = null;
  
  if (type === 'reply' && recipient_comment_id) {
    const { initiator_comment_id: replyInitiatorCommentId } = await postThreadReplied({
      initiator_comment_id: threadCommentItemId,
      recipient_comment_id: Number(recipient_comment_id),
    });
    
    if (!replyInitiatorCommentId) return;
    
    initiator_comment_id = replyInitiatorCommentId;
  }
  
  const { comment_id: threadCommentThreadsId } = await postThreadCommentThreads({
    comment_id: threadCommentItemId, thread_id
  });
  
  if (threadCommentItemId !== threadCommentThreadsId) return;
  
  const comment_id: string = threadCommentThreadsId;
  
  return { initiator_comment_id, comment_id };
}