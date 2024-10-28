'use server';

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { SetNote } from './set-note-friend.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';

export async function setUnNoteFriend({
  recipient, friend_id
}: Omit<SetNote, "note">) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error, status } = await api
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