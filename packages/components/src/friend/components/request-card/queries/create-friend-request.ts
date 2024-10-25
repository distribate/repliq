'use server';

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export async function createFriendRequest(reqUserNickname: string) {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400,
    error: 'Not authorized.',
    data: null,
  };
  
  const api = createClient();
  
  const { data, error, status } = await api
  .from('friends_requests')
  .insert({
    initiator: currentUser.nickname,
    recipient: reqUserNickname,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { status }
}