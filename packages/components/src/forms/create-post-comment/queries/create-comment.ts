'use server';

import 'server-only';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { PostCommentEntity, PostCommentRefEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

type PostComment = Pick<PostCommentEntity, 'content'>
type PostCommentRef = Pick<PostCommentRefEntity, 'post_id' | 'comment_id'>

async function postComment({
  content,
}: PostComment) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('p_comments')
  .insert({
    content,
    user_nickname: currentUser.nickname,
  })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

async function postCommentReferenced({
  post_id, comment_id,
}: PostCommentRef) {
  const api = createClient();
  
  const { data, error } = await api
  .from('posts_comments')
  .insert({
    post_id, comment_id,
  })
  .select()
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}

export async function createCommentReferenced({
  content, post_id,
}: PostComment & {
  post_id: string
}) {
  const comment = await postComment({
    content,
  });
  
  if (!comment) return;
  
  const post_comment = await postCommentReferenced({
    post_id,
    comment_id: comment.id,
  });
  
  if (!post_comment) {
    throw new Error('Dont post comment created');
  }
  
  return post_comment;
}