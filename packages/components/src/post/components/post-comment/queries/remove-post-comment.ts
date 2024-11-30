'use server';

import { createClient } from '../../../../../../lib/utils/api/supabase-client.ts';
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';
import { validateOwner } from '@repo/lib/helpers/validate-owner.ts';

export type RemovePostComment = Pick<PostCommentEntity, "id">

export async function removePostComment({
  id
}: RemovePostComment) {
  const isValid = await validateOwner({ id, type: "posts_comments" });
  if (!isValid) return;
  
  const api = createClient();
  
  const { error } = await api
  .from('posts_comments')
  .delete()
  .eq('id', id)
  
  return !error;
}