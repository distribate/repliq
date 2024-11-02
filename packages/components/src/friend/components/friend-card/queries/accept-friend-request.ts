'use server';

import { deleteFriendRequest } from './delete-friend-request.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { FriendRequestProperties } from '#friend/components/friend-card/types/friend-request-types.ts';

type AcceptFriendRequestType = Pick<FriendRequestProperties, 'initiator'> & {
  friend_id: string
}

type AcceptFriendRequest = {
  error: 'not-authorized' | 'delete-request-error' | null,
  status: number
}

export async function acceptFriendRequest({
  initiator, friend_id,
}: AcceptFriendRequestType): Promise<AcceptFriendRequest> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return {
    error: 'not-authorized', status: 400,
  };
  
  const { status: deteledFriendRequestStatus } = await deleteFriendRequest(friend_id);
  
  if (deteledFriendRequestStatus !== 204) return {
    error: 'delete-request-error', status: 400,
  };
  
  const api = createClient();
  
  const { status } = await api
  .from('users_friends')
  .insert({ user_1: initiator, user_2: currentUser.nickname });
  
  return { error: null, status };
}