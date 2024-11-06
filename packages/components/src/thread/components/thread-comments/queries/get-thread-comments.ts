'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { ThreadCommentEntity, ThreadCommentRepliedEntity, ThreadEntity } from '@repo/types/entities/entities-type.ts';

export type RequestDetails = Partial<{
  ascending: boolean,
  referencedTable: string
}>

type GetCommentsReplied = {
  initiatorId: Pick<ThreadCommentRepliedEntity, "initiator_comment_id">["initiator_comment_id"]
}

type GetCommentMore = Pick<ThreadComment, "id">

type GetComments = Pick<ThreadEntity, 'id'> & RequestDetails

type RepliedDetails = {
  replied: Pick<ThreadCommentEntity, "id" | "content" | "user_nickname"> | null;
}

export type ThreadComment = RepliedDetails & ThreadCommentEntity

export async function getCommentsReplied({
  initiatorId
}: GetCommentsReplied): Promise<
  Pick<ThreadCommentRepliedEntity, "recipient_comment_id"> | null
> {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments_replies')
  .select('recipient_comment_id')
  .eq('initiator_comment_id', initiatorId)
  .single()
  
  if (error) return null;
  
  return data
}

async function getComment({
  id: comment_id
}: GetCommentMore) {
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
  id: threadId, ascending
}: GetComments) {
  const api = createClient();
  
  const { data, error } = await api
  .from('threads_comments')
  .select(`id,created_at,user_nickname,content,edited`)
  .eq('thread_id', threadId)
  .order('created_at', { ascending });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data as ThreadComment[]
}

export async function getThreadComments(threadId: string): Promise<ThreadComment[] | null> {
  const comments = await getComments({
    id: threadId, ascending: true
  });
  
  return await Promise.all(
    comments.map(async(comment) => {
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