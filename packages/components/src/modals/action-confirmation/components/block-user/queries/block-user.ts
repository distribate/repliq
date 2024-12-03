"use server"

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

export async function blockUser(requestedNickname: string) {
  const { user: currentUser } = await getCurrentSession();
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