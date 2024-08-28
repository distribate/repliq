'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

export async function deleteFriend(friend_id: string) {
  const currentUser = await getCurrentUser();
  const supabase = createClient();
  
  if (!currentUser) return {
    status: 400,
    error: 'Not authorized.',
  };
  
  const { error, status } = await supabase
  .from('users_friends')
  .delete()
  .eq('id', friend_id)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { status }
}