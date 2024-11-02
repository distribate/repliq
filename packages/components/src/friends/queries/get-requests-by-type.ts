'use server';

import { createClient } from "@repo/lib/utils/api/server.ts";
import { FriendRequestEntity } from '@repo/types/entities/entities-type.ts';
import { FriendsRequestsProperties } from '#friends/types/friends-requests-types.ts';

export type FriendsRequestsType = 'incoming' | 'outgoing';

export async function getRequestsByType({
  type, nickname
}: FriendsRequestsProperties): Promise<FriendRequestEntity[]> {
  const requestType = type === 'incoming' ? 'recipient' : 'initiator';
  
  const api = createClient();
  
  const { data: friendsRequests, error } = await api
  .from('friends_requests')
  .select('id, recipient, initiator, created_at')
  .eq(requestType, nickname)
  .returns<FriendRequestEntity[]>()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return friendsRequests;
}