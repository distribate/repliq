'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { ThreadRequest } from '../../../types/thread-request-types.ts';
import { RequestDetails, RequestOptionsSupabaseClient } from '@repo/types/config/request-types.ts';

type CommentsReplied = {
  initiatorId: string
}

type GetCommentsReplied = RequestOptionsSupabaseClient & CommentsReplied
type GetCommentMore = RequestOptionsSupabaseClient & {
  commentId: string
}

type GetThreadComments = ThreadRequest & {
  comments: boolean
}

type GetComments = RequestOptionsSupabaseClient & ThreadRequest & RequestDetails

export async function getCommentsReplied({
  initiatorId, supabase,
}: GetCommentsReplied) {
  const { data, error } = await supabase
  .from('t_comments_replies')
  .select('recipient_comment_id')
  .eq('initiator_comment_id', initiatorId)
  .single();
  if (error) return null;
  
  return data;
}

async function getCommentMore({
  commentId, supabase,
}: GetCommentMore) {
  const { data, error } = await supabase
  .from('t_comments')
  .select(`id,content,user_nickname`)
  .eq('id', commentId)
  .single();
  
  if (error) throw new Error(error.message);
  
  return data;
}

async function getComments({
  supabase, thread_id: threadId, ascending
}: GetComments) {
  const { data, error } = await supabase
  .from('threads_comments')
  .select(`comment_id, t_comments(id,created_at,user_nickname,content)`)
  .eq('thread_id', threadId)
  .order('created_at', {
    referencedTable: 't_comments', ascending,
  });
  if (error) throw new Error(error.message);
  
  return data;
}

export async function getThreadComments({
  thread_id, comments
}: GetThreadComments) {
  const supabase = createClient();
  
  if (!comments) return null;
  
  const data = await getComments({
    thread_id, ascending: true, supabase
  })
  
  const rawComments = data.flatMap(item => item.t_comments);

  return await Promise.all(
    rawComments.map(async(item) => {
      const replied = await getCommentsReplied({
        initiatorId: item.id, supabase
      });
      
      let repliedComment = null;
      
      if (replied) {
        repliedComment = await getCommentMore({
          commentId: replied.recipient_comment_id, supabase
        });
      }
      
      return { ...item, replied: repliedComment };
    }),
  );
}