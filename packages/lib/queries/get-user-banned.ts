"use server"

import { createClient } from '../utils/supabase/server.ts';

type GetUserBanned = {
  reqUserNickname: string
}

export async function getUserBanned({
  reqUserNickname
}: GetUserBanned) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users_banned')
  .select('nickname')
  .eq("nickname", reqUserNickname)
  .single()
  
  if (error) return null;
  
  return data;
}