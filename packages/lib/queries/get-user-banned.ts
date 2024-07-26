"use server"

import { createClient } from '../utils/supabase/server.ts';

type GetUserBanned = {
  nickname: string
}

export async function getUserBanned({
  nickname
}: GetUserBanned) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from("users_banned")
  .select("nickname, reason, time")
  .eq('nickname', nickname)
  .single();
  
  if (error) return null;
  
  return data;
}