"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export type DeleteUserFromBlocked = {
  currentUserNickname: string,
  targetUserNickname: string
}

export async function deleteUserFromBlocked({
  currentUserNickname, targetUserNickname
}: DeleteUserFromBlocked) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users_blocked')
  .delete()
  .eq('user_1', currentUserNickname)
  .eq('user_2', targetUserNickname)
  .select("user_1")
  .single();
  
  if (error) {
    throw new Error(error.message);
  }

  return data;
}