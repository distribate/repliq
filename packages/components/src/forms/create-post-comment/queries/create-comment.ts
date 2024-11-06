'use server';

import 'server-only';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';
import { createClient } from "@repo/lib/utils/api/server.ts";

type PostComment = Pick<PostCommentEntity, "content"> & {
  post_id: string
}

export async function postComment({
  content, post_id
}: PostComment) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('posts_comments')
  .insert({
    content, user_nickname: currentUser.nickname,
    post_id
  })
  .select('id')
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}