"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

type ValidatePostOwner = {
  postId: string
}

export async function validatePostOwner({
  postId,
}: ValidatePostOwner) {
  const currentUser = await getCurrentUser()
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('posts_users')
  .select('user_nickname')
  .eq('user_nickname', currentUser.nickname)
  .eq('post_id', postId)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.user_nickname === currentUser.nickname;
}