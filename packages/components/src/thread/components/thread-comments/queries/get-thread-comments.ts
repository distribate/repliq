'use server';

import 'server-only';
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadCommentEntity, ThreadCommentRepliedEntity } from '@repo/types/entities/entities-type.ts';

export type RequestDetails = Partial<{
  ascending: boolean,
  referencedTable: string
}>

type GetCommentsReplied = {
  initiatorId: Pick<ThreadCommentRepliedEntity, "initiator_comment_id">["initiator_comment_id"]
}

type GetCommentMore = {
  commentId: string
}

type GetComments = ThreadRequest & RequestDetails

type RepliedDetails = {
  replied: {
    id: number;
    content: string;
    user_nickname: string;
  } | null;
}

export type ThreadComment = RepliedDetails & ThreadCommentEntity

export async function getCommentsReplied({
  initiatorId
}: GetCommentsReplied) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_replies')
  .select('recipient_comment_id')
  .eq('initiator_comment_id', initiatorId)
  .single()
  
  if (error) return null;
  
  return data as Pick<ThreadCommentRepliedEntity, "recipient_comment_id">;
}

async function getCommentMore({
  commentId,
}: GetCommentMore) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .select(`id,content,user_nickname,edited`)
  .eq('id', commentId)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as ThreadCommentEntity;
}

async function getComments({
  thread_id: threadId, ascending,
}: GetComments) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_ref')
  .select(`comment_id, threads_comments(id,created_at,user_nickname,content,edited)`)
  .eq('thread_id', threadId)
  .order('created_at', {
    referencedTable: 'threads_comments', ascending
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.flatMap(
    item => item.threads_comments,
  ) as ThreadComment[];
}

export async function getThreadComments(threadId: string): Promise<ThreadComment[] | undefined> {
  const data = await getComments({
    thread_id: threadId, ascending: true,
  });
  
  return await Promise.all(
    data.map(async(item) => {
      const replied = await getCommentsReplied({
        initiatorId: item.id,
      });
      
      let repliedComment = null;
      
      if (replied) {
        repliedComment = await getCommentMore({
          commentId: replied.recipient_comment_id.toString(),
        });
      }
      
      return { ...item, replied: repliedComment };
    }),
  ) || []
}