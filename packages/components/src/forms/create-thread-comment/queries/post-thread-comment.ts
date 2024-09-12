'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { T_COMMENT, THREAD_COMMENT, THREAD_COMMENT_REPLIED } from '@repo/types/entities/entities-type.ts';
import { CreateThreadCommentType } from './create-thread-comment-query.ts';

export async function postThreadReplied({
  initiator_comment_id, recipient_comment_id,
}: Omit<THREAD_COMMENT_REPLIED, 'id' | 'created_at'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('t_comments_replies')
  .insert({
    initiator_comment_id,
    recipient_comment_id,
  })
  .select('initiator_comment_id')
  .single();
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadCommentItem({
  user_nickname, content,
}: Pick<T_COMMENT, 'content' | 'user_nickname'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('t_comments')
  .insert({
    user_nickname,
    content,
  })
  .select('id')
  .single();
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function postThreadCommentThreads({
  comment_id, thread_id,
}: Pick<THREAD_COMMENT, 'thread_id' | 'comment_id'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('threads_comments')
  .insert({
    comment_id, thread_id,
  })
  .select('comment_id')
  .single();
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export type PostThreadComment = Pick<THREAD_COMMENT, 'thread_id'>
  & Pick<T_COMMENT, 'content' | 'user_nickname'> & {
  type: CreateThreadCommentType,
  recipient_comment_id?: string
}

export async function postThreadComment({
  thread_id, content, user_nickname, type = 'single', recipient_comment_id,
}: PostThreadComment) {
  const supabase = createClient()
  if (!thread_id || !content || !user_nickname) return;
  
  const { data, error } = await supabase
    .from("threads")
    .select("comments")
    .eq("id", thread_id)
    .single()
  
  if (!data || !data.comments || error) return;
  
  const { id: threadCommentItemId } = await postThreadCommentItem({
    user_nickname,
    content,
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
    comment_id: threadCommentItemId,
    thread_id: thread_id,
  });
  
  if (threadCommentItemId !== threadCommentThreadsId) return;
  
  const comment_id: string = threadCommentThreadsId;
  
  return { initiator_comment_id, comment_id };
}