'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { SetNote } from './set-note-friend.ts';

export async function setUnNoteFriend({
  recipient, friend_id
}: Omit<SetNote, "note">) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  const { data, error, status } = await supabase
  .from('friends_notes')
  .delete()
  .eq('friend_id', friend_id)
  .eq('recipient', recipient)
  .eq('initiator', currentUser?.nickname);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return { data, status };
}