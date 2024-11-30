"use server"

import { createClient } from '../../../../../../lib/utils/api/supabase-client.ts';
import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type EditPost = Pick<PostEntity, 'id'> & {
  content: string
}

export async function editPost({
  content, id: postId
}: EditPost) {
  const isValid = validatePostOwner({ postId });
  if (!isValid) return;
  
  const api = createClient()
  
  const { error } = await api
    .from("posts")
    .update({ content, isUpdated: true })
    .eq("id", postId)
  
  return !error;
}