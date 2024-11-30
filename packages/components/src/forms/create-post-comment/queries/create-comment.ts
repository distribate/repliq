'use server';

import 'server-only';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from "../../../../../lib/utils/api/supabase-client.ts";

type PostComment = Pick<PostCommentEntity, "content"> & {
  post_id: string
}

async function validatePostComments(postId: string): Promise<boolean> {
  const api = createClient()
  
  const { data, error } = await api
    .from("posts")
    .select("isComments")
    .eq("id", postId)
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data.isComments as boolean;
}

export async function postComment({
  content, post_id
}: PostComment) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const isValid = await validatePostComments(post_id)
  if (!isValid) return;
  
  const api = createClient();
  
  const { error } = await api
  .from('posts_comments')
  .insert({
    content,
    user_nickname: currentUser.nickname,
    post_id
  })
  
  return !error;
}