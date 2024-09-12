"use server"

import "server-only"
import { createClient } from '@repo/lib/utils/supabase/server.ts';
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tables } from '@repo/types/entities/supabase.ts';

export type SetNote = Pick<Tables<"friends_notes">, "friend_id" | "note" | "recipient">

export async function setNoteFriend({
  recipient, friend_id, note, isNoted
}: SetNote & {
  isNoted: boolean // if friend already have a note
}) {
  const supabase = createClient();
  const currentUser = await getCurrentUser();
  
  if (!isNoted) {
    const { data, error, status } = await supabase
    .from("friends_notes")
    .insert({
      friend_id: friend_id,
      recipient: recipient,
      initiator: currentUser?.nickname,
      note: note
    })

    if (error) {
      throw new Error(error.message)
    }
    
    return { data, status }
  }
  
  const { data, error, status } = await supabase
  .from("friends_notes")
  .update({
    note: note
  })
  .eq("recipient", recipient)
  .eq("friend_id", friend_id)
  .eq("initiator", currentUser?.nickname)
  
  if (error) {
    throw new Error(error.message)
  }
  
  return { data, status }
}