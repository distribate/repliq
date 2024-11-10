'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { validatePostOwner } from '#post/components/post-item/queries/validate-owner-post.ts';
import { ControlPost } from '#post/components/post-item/types/control-post-types.ts';

type RemovePost = ControlPost

export async function removePost({
  id: postId
}: RemovePost) {
  const isValid = await validatePostOwner({ postId })
  if (!isValid) return
  
  const api = createClient();
  
  const { error } = await api
  .from('posts')
  .delete()
  .eq('id', postId);
  
  return !error;
}