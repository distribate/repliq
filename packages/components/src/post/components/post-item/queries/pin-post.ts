"use server"

import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type PinPost = Pick<PostEntity, 'id'> & {
  isPinned: boolean
}

export async function pinPost({
  id: postId, isPinned
}: PinPost) {
  const isValid = await validatePostOwner({ postId })
  if (!isValid) return;
  
  const api = createClient()
  
  const { error } = await api
    .from("posts")
    .update({
      isPinned: !isPinned
    })
    .eq("id", postId)
  
  return !error;
}