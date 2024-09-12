'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

export type RequestProperties = {
  initiator: string
}

export async function deleteFriendRequest(
  friend_id: string
) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!currentUser) return {
    status: 400,
    data: null,
    error: 'Not authorized.',
  };
  
  const { error, status } = await supabase
  .from('friends_requests')
  .delete()
  .eq("id", friend_id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { status }
}