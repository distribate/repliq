'use server';

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export type RequestProperties = {
  initiator: string
}

export async function deleteFriendRequest(
  friend_id: string
) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400,
    data: null,
    error: 'Not authorized.',
  };
  
  const api = createClient();
  
  const { error, status } = await api
  .from('friends_requests')
  .delete()
  .eq("id", friend_id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { status }
}