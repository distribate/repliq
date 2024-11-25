'use server';

import "server-only"
import { ThreadCommentEntity, ThreadCommentRepliedEntity } from '@repo/types/entities/entities-type.ts';
import { CreateThreadCommentType } from './create-thread-comment-query.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type PostThreadComment = Pick<ThreadCommentEntity,
  'thread_id' | "content"
> & {
  type: CreateThreadCommentType,
  recipient_comment_id?: Pick<ThreadCommentRepliedEntity, "recipient_comment_id">["recipient_comment_id"]
}

type PostThreadReplied = Omit<ThreadCommentRepliedEntity, 'id' | 'created_at'>
type PostThreadCommentItem = Pick<ThreadCommentEntity, 'content' | "thread_id">

export async function postThreadReplied({
  initiator_comment_id, recipient_comment_id,
}: PostThreadReplied) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_replies')
  .insert({ initiator_comment_id, recipient_comment_id, })
  .select('initiator_comment_id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadCommentItem({
  content, thread_id
}: PostThreadCommentItem) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .insert({ user_nickname: currentUser.nickname, content, thread_id })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.id;
}

async function validatePostCommented(thread_id: string) {
  const api = createClient();
  
  const { data, error } = await api
  .from("threads")
  .select("isComments")
  .eq("id", thread_id)
  .single()
  
  if (error || !data) {
    throw new Error(error.message);
  }
  
  return data.isComments;
}

export async function postThreadComment({
  thread_id, content,  type = 'single', recipient_comment_id,
}: PostThreadComment) {
  if (!thread_id || !content) return;
  
  const isPostCommented = await validatePostCommented(thread_id);
  if (!isPostCommented) return;
  
  const commentItemId = await postThreadCommentItem({ content, thread_id });
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