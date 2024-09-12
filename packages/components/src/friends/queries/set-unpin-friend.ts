'use server';

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { SetPinFriend } from './set-pin-friend.ts';

export async function setUnpinFriend({
  recipient, friend_id,
}: SetPinFriend) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  const { data, error, status } = await supabase
  .from('friends_pinned')
  .delete()
  .eq('friend_id', friend_id)
  .eq('initiator', currentUser?.nickname)
  .eq('recipient', recipient);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { data, status };
}