'use server';

import "server-only"
import { Tables } from '@repo/types/entities/supabase.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export type FriendsRequests = 'incoming' | 'outgoing';

type RequestsProperties = {
  type: FriendsRequests,
  nickname?: string
}

export type GetRequestsByType = Tables<"friends_requests">

export async function getRequestsByType({
  type, nickname,
}: RequestsProperties) {
  const requestType = type === 'incoming' ? 'recipient' : 'initiator';
  
  const api = createClient();
  
  return api
  .from('friends_requests')
  .select('id, recipient, initiator, created_at')
  .eq(requestType, nickname)
  .returns<GetRequestsByType[]>()
}