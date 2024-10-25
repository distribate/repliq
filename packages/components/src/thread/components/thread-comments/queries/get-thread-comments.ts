'use server';

import "server-only"
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { RequestDetails } from '@repo/types/config/request-types.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type GetCommentsReplied = {
  initiatorId: string
}

type GetCommentMore = {
  commentId: string
}

type GetThreadComments = ThreadRequest & {
  comments: boolean
}

type GetComments = ThreadRequest & RequestDetails

export async function getCommentsReplied({
  initiatorId,
}: GetCommentsReplied) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_replies')
  .select('recipient_comment_id')
  .eq('initiator_comment_id', initiatorId)
  .single();
  
  if (error) return null;
  
  return data;
}

async function getCommentMore({
  commentId
}: GetCommentMore) {
  const api = createClient();
  
  const { data, error } = await api
  .from('thread_comments')
  .select(`id,content,user_nickname`)
  .eq('id', commentId)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

async function getComments({
  thread_id: threadId, ascending
}: GetComments) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_ref')
  .select(`comment_id, threads_comments(id,created_at,user_nickname,content)`)
  .eq('thread_id', threadId)
  .order('created_at', {
    referencedTable: 'threads_comments', ascending,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function getThreadComments({
  thread_id, comments
}: GetThreadComments) {
  if (!comments) return null;
  
  const data = await getComments({
    thread_id, ascending: true
  })
  
  const rawComments = data.flatMap(item => item.threads_comments);

  return await Promise.all(
    rawComments.map(async(item) => {
      const replied = await getCommentsReplied({
        initiatorId: item.id
      });
      
      let repliedComment = null;
      
      if (replied) {
        repliedComment = await getCommentMore({
          commentId: replied.recipient_comment_id
        });
      }
      
      return { ...item, replied: repliedComment };
    }),
  );
}