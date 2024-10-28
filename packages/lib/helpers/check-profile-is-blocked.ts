'use server';

import { createClient } from "@repo/lib/utils/api/server.ts";
import { CheckProfileStatus } from './check-profile-status.ts';

type GetUserBlockStatus = {
  reqUserNickname: string
}

async function getUserBlockStatus({
  reqUserNickname,
}: GetUserBlockStatus) {
  const supabase = createClient();
  
  const { data, error } = await supabase
  .from('users_blocked')
  .select('user_1, user_2')
  .or(`user_1.eq.${reqUserNickname},user_2.eq.${reqUserNickname}`)
  .single()
  
  if (error) return null;
  
  return data;
}

export async function checkProfileIsBlocked(
  requestedUser: Pick<CheckProfileStatus, "requestedUser">["requestedUser"]
): Promise<{ user_1: string, user_2: string } | null> {
  const requestedUserNickname = requestedUser.nickname;
  
  if (!requestedUserNickname) return null;
  
  const result = await getUserBlockStatus({
    reqUserNickname: requestedUserNickname,
  });
  
  if (!result) return null;
  
  return result;
}