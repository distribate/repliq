'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import {
  RequestDetails,
  ThreadCommentEntity,
  ThreadCommentRepliedEntity,
  ThreadEntity,
} from '@repo/types/entities/entities-type.ts';

type GetCommentsReplied = {
  initiatorId: Pick<ThreadCommentRepliedEntity, "initiator_comment_id">["initiator_comment_id"]
}

type GetComments = Pick<ThreadEntity, 'id'> & RequestDetails

type RepliedDetails = {
  replied: Pick<ThreadCommentEntity, "id" | "content" | "user_nickname"> | null;
}

type GetThreadComments = {
  threadId: string
} & RequestDetails

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
  
  return data as Pick<ThreadCommentRepliedEntity, "recipient_comment_id">
}

async function getComment({
  id: comment_id
}: Pick<ThreadComment, "id">) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .select(`id,created_at,content,user_nickname,edited`)
  .eq('id', comment_id)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as ThreadCommentEntity;
}

async function getComments({
  id: threadId, range, limit, ascending
}: GetComments) {
  const api = createClient();
  
  let query = api
  .from('threads_comments')
  .select(`id,created_at,user_nickname,content,edited`)
  .eq('thread_id', threadId)
  .order('created_at', { ascending });
  
  if (range) query.range(range[0], range[1])
  if (limit) query.limit(limit)

  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }
  
  if (!data.length) return null;
  
  return data as ThreadComment[]
}

export async function getThreadComments({
  threadId, ...filter
}: GetThreadComments): Promise<ThreadComment[] | null> {
  const threadComments = await getComments({
    id: threadId, ascending: true, ...filter
  });
  
  if (!threadComments) return null;
  
  return await Promise.all(
    threadComments.map(async(comment) => {
      const replied = await getCommentsReplied({
        initiatorId: comment.id,
      });
      
      let repliedComment = null;
      
      if (replied) {
        repliedComment = await getComment({
          id: replied.recipient_comment_id
        });
      }
      
      return { ...comment, replied: repliedComment };
    }),
  )
}