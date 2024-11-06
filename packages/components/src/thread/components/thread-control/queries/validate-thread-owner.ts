"use server"

import { createClient } from '@repo/lib/utils/api/server.ts';

type ValidateThreadOwner = {
  threadId: string,
  currentUserNickname: string
}

export async function validateThreadOwner({
  threadId, currentUserNickname
}: ValidateThreadOwner) {
  const api = createClient();
  
  const { data, error } = await api
  .from("threads_users")
  .select("user_nickname")
  .eq("thread_id", threadId)
  .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return currentUserNickname === data.user_nickname
}