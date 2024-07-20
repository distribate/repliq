'use server';

import { CheckProfileStatus } from './check-profile-status.ts';
import { getUserBanned } from '../queries/get-user-banned.ts';

export async function checkProfileIsBanned({
  requestedUser
}: Pick<CheckProfileStatus, "requestedUser">): Promise<{ nickname: string } | null> {
  const requestedUserNickname = requestedUser.nickname;
  
  if (!requestedUserNickname) return null;
  
  const result = await getUserBanned({
    reqUserNickname: requestedUserNickname,
  });
  
  if (!result) return null;
  
  return result;
}