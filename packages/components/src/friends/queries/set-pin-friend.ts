"use server"

import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

export type SetPinFriend = Pick<Tables<"friends_pinned">, "friend_id" | "recipient">

export async function setPinFriend({
  recipient, friend_id
}: SetPinFriend) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();

  const { data, error, status } = await supabase
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