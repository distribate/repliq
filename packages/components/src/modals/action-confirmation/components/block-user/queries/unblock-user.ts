'use server';

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '../../../../../../../lib/utils/api/supabase-client.ts';

export async function unblockUser(requestedNickname: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  if (currentUser.nickname === requestedNickname) return;
  
  const { error } = await api
  .from('users_blocked')
  .delete()
  .eq('initiator', currentUser.nickname)
  .eq('recipient', requestedNickname)
  
  if (error) {
    return false
  }
  
  return !error;
}