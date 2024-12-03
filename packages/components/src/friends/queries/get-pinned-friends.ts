"use server"

import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { FriendPinnedEntity } from '@repo/types/entities/entities-type.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

export async function getPinnedFriends() {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error } = await api
  .from('friends_pinned')
  .select()
  .eq('initiator', currentUser.nickname)
  .returns<FriendPinnedEntity[]>();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
}