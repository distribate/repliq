"use server"

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { createClient } from '@repo/lib/utils/api/server.ts';
import { FriendPinnedEntity } from '@repo/types/entities/entities-type.ts';

export type SetPinFriend = Pick<FriendPinnedEntity, "friend_id" | "recipient">

export async function setPinFriend({
  recipient, friend_id
}: SetPinFriend) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  const { data, error, status } = await api
    .from("friends_pinned")
    .insert({
      friend_id: friend_id,
      initiator: currentUser?.nickname,
      recipient: recipient
    })
    
  if (error) {
    throw new Error(error.message)
  }
  
  return { data, status }
}