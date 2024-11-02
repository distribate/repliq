"use server"

import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { FriendPinnedEntity } from '@repo/types/entities/entities-type.ts';

export async function getPinnedFriends() {
  const currentUser = await getCurrentUser();
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