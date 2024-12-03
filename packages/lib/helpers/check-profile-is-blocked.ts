'use server';

import { createClient } from "#utils/api/supabase-client.ts";
import { getCurrentSession } from '#actions/get-current-session.ts';

async function getUserBlockStatus(requestedUserNickname: string) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return null;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('users_blocked')
  .select('initiator, recipient')
  .or(`initiator.eq.${currentUser.nickname},recipient.eq.${requestedUserNickname}`)
  .single()

  if (error) return null;
  
  return data;
}

export type CheckProfileIsBlocked = {
  recipient: string,
  initiator: string
}

export async function checkProfileIsBlocked(
  requestedUserNickname: string
): Promise<CheckProfileIsBlocked | null> {
  if (!requestedUserNickname) return null;
  
  const result = await getUserBlockStatus(requestedUserNickname);
  
  if (!result) return null;
  
  return result;
}