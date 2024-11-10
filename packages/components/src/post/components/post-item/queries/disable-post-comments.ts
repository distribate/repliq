"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { ControlPost } from '#post/components/post-item/types/control-post-types.ts';

type DisablePostComments = ControlPost & {
  isComments: boolean
}

export async function disablePostComments({
  id: postId, isComments
}: DisablePostComments) {
  const isValid = await getCurrentUser();
  if (!isValid) return;
  
  const api = createClient()
  
  const { error } = await api
    .from("posts")
    .update({ isComments: !isComments })
    .eq("id", postId)
  
  return !error;
}