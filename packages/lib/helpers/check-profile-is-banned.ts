'use server';

import { CheckProfileStatus } from './check-profile-status.ts';
import { getUserBanned } from '../queries/get-user-banned.ts';

export async function checkProfileIsBanned(
  nickname: Pick<CheckProfileStatus, "requestedUser">["requestedUser"]["nickname"]
): Promise<{
  nickname: string, reason: string, time: string
} | null> {
  if (!nickname) return null;
  
  const result = await getUserBanned(nickname);
  
  if (!result) return null;
  
  return result;
}