"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '../../../../lib/utils/api/supabase-client.ts';
import { FriendNotesEntity } from '@repo/types/entities/entities-type.ts';

export async function getNotedFriends() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('friends_notes')
  .select()
  .eq('initiator', currentUser.nickname)
  .returns<FriendNotesEntity[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}