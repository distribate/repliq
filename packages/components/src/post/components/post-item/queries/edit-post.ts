"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { ControlPost } from '#post/components/post-item/types/control-post-types.ts';

type EditPost = ControlPost & {
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
    .update({
      content, isUpdated: true
    })
    .eq("id", postId)
  
  return !error;
}