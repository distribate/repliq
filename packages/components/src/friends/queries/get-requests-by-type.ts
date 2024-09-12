'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

export type FriendsRequests = 'incoming' | 'outgoing';

type RequestsProperties = {
  type: FriendsRequests,
  nickname?: string
}

export type GetRequestsByType = Tables<"friends_requests">

export async function getRequestsByType({
  type, nickname,
}: RequestsProperties) {
  const supabase = createClient();
  
  const requestType = type === 'incoming' ? 'recipient' : 'initiator';
  
  return supabase
  .from('friends_requests')
  .select('id, recipient, initiator, created_at')
  .eq(requestType, nickname)
  .returns<GetRequestsByType[]>()
}