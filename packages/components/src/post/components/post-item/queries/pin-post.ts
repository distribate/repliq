"use server"

import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { ControlPost } from '#post/components/post-item/types/control-post-types.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

type PinPost = ControlPost & {
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