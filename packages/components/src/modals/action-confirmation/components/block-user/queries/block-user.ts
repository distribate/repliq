"use server"

import { createClient } from '../../../../../../../lib/utils/api/supabase-client.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

export async function blockUser(requestedNickname: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  if (currentUser.nickname === requestedNickname) return;
  
  const { error, statusText } = await api
    .from("users_blocked")
    .insert({
      initiator: currentUser.nickname, recipient: requestedNickname
    })
  
  if (error) {
    return false;
  }
  
  if (statusText === 'No Content') {
    return false;
  }
  
  return !error;
}