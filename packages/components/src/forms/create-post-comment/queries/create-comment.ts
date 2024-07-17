'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

type POST_COMMENT = Tables<'p_comments'>
type POST_COMMENTS = Tables<'posts_comments'>

export type PostComment = Pick<POST_COMMENT, 'content'>
type PostCommentRef = Pick<POST_COMMENTS, 'post_id' | 'comment_id'>

async function postComment({
  content,
}: PostComment) {
  const supabase = createClient();
  
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return;
  
  const { data, error } = await supabase
  .from('p_comments')
  .insert({
    content,
    user_nickname: currentUser.nickname,
  })
  .select('id')
  .single();
  
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

async function postCommentReferenced({
  post_id, comment_id,
}: PostCommentRef) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('posts_comments')
  .insert({
    post_id, comment_id,
  })
  .select()
  .single();
  
  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  
  return data;
}

export async function createCommentReferenced({
  content, post_id,
}: PostComment & {
  post_id: string
}) {
  try {
    const comment = await postComment({
      content,
    });
    
    if (!comment) return;
    
    const post_comment = await postCommentReferenced({
      post_id,
      comment_id: comment.id,
    });
    
    if (!post_comment) {
      throw new Error("Dont post comment created")
    }
    
    return post_comment;
  } catch (e) {
    console.error(e);
  }
}