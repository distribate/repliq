'use server';

import { createClient } from "@repo/lib/utils/api/server.ts";
import { FriendRequestEntity } from '@repo/types/entities/entities-type.ts';

export type FriendsRequests = 'incoming' | 'outgoing';

type RequestsProperties = {
  type: FriendsRequests,
  nickname?: string
}

export async function getRequestsByType({
  type, nickname,
}: RequestsProperties) {
  const requestType = type === 'incoming' ? 'recipient' : 'initiator';
  
  const api = createClient();
  
  return api
  .from('friends_requests')
  .select('id, recipient, initiator, created_at')
  .eq(requestType, nickname)
  .returns<FriendRequestEntity[]>()
}