"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/api/supabase-client.ts';
import { FriendPinnedEntity } from '@repo/types/entities/entities-type.ts';
import { getCurrentSession } from '@repo/lib/actions/get-current-session.ts';

export type SetPinFriend = Pick<FriendPinnedEntity, "friend_id" | "recipient">

export async function setPinFriend({
  recipient, friend_id
}: SetPinFriend) {
  const { user: currentUser } = await getCurrentSession();
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