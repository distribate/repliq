'use server';

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { checkProfileIsBlocked } from '@repo/lib/helpers/check-profile-is-blocked.ts';
import { getBlockType, ProfileStatusBlockedType } from '@repo/lib/helpers/check-profile-status.ts';

type CreateFriendRequest = {
  status: number,
  error: 'already-friends' | 'not-authorized' | ProfileStatusBlockedType | null
};

export async function createFriendRequest(requestedUserNickname: string): Promise<CreateFriendRequest> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400, error: 'not-authorized',
  };
  
  const api = createClient();
  
  const blockStatus = await checkProfileIsBlocked(requestedUserNickname);
  
  if (blockStatus) {
    return {
      status: 404,
      error: await getBlockType({
        requestedUserNickname,
        initiator: blockStatus.initiator,
        recipient: blockStatus.recipient,
      }),
    };
  }
  
  const { count } = await api
  .from('users_friends')
  .select('*', { count: 'exact' })
  .eq('user_1', currentUser.nickname)
  .eq('user_2', requestedUserNickname);
  
  const isExisting: boolean = count ? count !== 0 : false;
  
  console.log(count, isExisting)
  
  if (isExisting) return {
    status: 400, error: 'already-friends',
  };
  
  const { error, status } = await api
  .from('friends_requests')
  .insert({
    initiator: currentUser.nickname,
    recipient: requestedUserNickname,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { error: null, status };
}