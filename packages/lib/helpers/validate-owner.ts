"use server"

import { getCurrentUser } from '#actions/get-current-user.ts';
import { createClient } from '#utils/api/supabase-client.ts';

export type ValidateOwner = {
  type: "posts_comments" | "threads_comments",
  id: number
}

export async function validateOwner({
  id, type
}: ValidateOwner) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data: commentCreator, error } = await api
  .from(type)
  .select('user_nickname')
  .eq('id', id)
  .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return commentCreator.user_nickname === currentUser.nickname;
}