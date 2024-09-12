'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type RemovePostComment = {
  comment_id: string,
  nickname: string
}

async function removePostCommentReferenced({
  comment_id, nickname,
}: RemovePostComment) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('p_comments')
  .delete()
  .eq('id', comment_id)
  .eq('user_nickname', nickname)
  .select();
  
  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function removePostComment({
  nickname, comment_id,
}: RemovePostComment) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  if (currentUser.nickname !== nickname) return;
  
  try {
    const result = await removePostCommentReferenced({
      comment_id, nickname,
    });
    
    if (!result) return;
    
    return result;
  } catch (e) {
    console.error(e);
  }
}