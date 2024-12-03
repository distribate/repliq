'use server';

import 'server-only';
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

type DeleteFriendRequest = {
  status: number,
  error: 'not-authorized' | null
}

export async function deleteFriendRequest(
  friend_id: string,
): Promise<DeleteFriendRequest> {
  const { user: currentUser } = await getCurrentSession();
  
  if (!currentUser) return {
    status: 400, error: 'not-authorized',
  };
  
  const api = createClient();
  
  const { error, status } = await api
  .from('friends_requests')
  .delete()
  .eq('id', friend_id);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { error: null, status, };
}