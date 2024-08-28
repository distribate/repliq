'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

export async function createFriendRequest(reqUserNickname: string) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400,
    error: 'Not authorized.',
    data: null,
  };
  
  const { data, error, status } = await supabase
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