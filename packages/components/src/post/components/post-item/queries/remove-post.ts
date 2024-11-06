'use server';

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { PostEntity } from '@repo/types/entities/entities-type.ts';

type RemovePost = Pick<PostEntity, "id"> & {
  nickname: string
}

export async function removePost({
  id, nickname,
}: RemovePost) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  if (currentUser.nickname !== nickname) return;
  
  const { data, error } = await api
  .from('posts')
  .delete()
  .eq('id', id)
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}