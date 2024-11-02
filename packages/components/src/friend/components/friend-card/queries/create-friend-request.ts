'use server';

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

type CreateFriendRequest = {
  status: number,
  error: 'already-friends' | 'not-authorized' | null
};

export async function createFriendRequest(reqUserNickname: string): Promise<CreateFriendRequest> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400, error: 'not-authorized',
  };
  
  const api = createClient();
  
  const { count } = await api
  .from('users_friends')
  .select('*', { count: 'exact' })
  .eq('user_1', currentUser)
  .eq('user_2', reqUserNickname);
  
  const isExisting: boolean = count ? count !== 0 : false;

  if (isExisting) return {
    status: 400, error: 'already-friends',
  };
  
  const { error, status } = await api
  .from('friends_requests')
  .insert({
    initiator: currentUser.nickname,
    recipient: reqUserNickname,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { error: null, status };
}