'use server';

import { createClient } from '@repo/lib/utils/api/server.ts';
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';
import { validateOwner } from '@repo/lib/helpers/validate-owner.ts';

export type RemovePostComment = Pick<PostCommentEntity, "id">

export async function removePostComment({
  id
}: RemovePostComment) {
  const isValid = await validateOwner({ id, type: "posts_comments" });
  if (!isValid) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('posts_comments')
  .delete()
  .eq('id', id)
  .select();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}