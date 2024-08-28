'use server';

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { deleteFriendRequest, RequestProperties } from './delete-friend-request.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';

async function addFieldToFields({
  initiator,
}: RequestProperties) {
  const currentUser = await getCurrentUser();
  const supabase = createClient();
  
  if (!currentUser) return;
  
  return supabase
  .from('users_friends')
  .insert({
    user_1: initiator,
    user_2: currentUser.nickname,
  });
}

export async function acceptFriendRequest({
  initiator, friend_id,
}: RequestProperties & {
  friend_id: string
}) {
  const { status } = await deleteFriendRequest(friend_id);
  
  if (status !== 204) return null;
  
  return addFieldToFields({ initiator });
}