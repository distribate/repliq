"use server"

import "server-only"
import { getCurrentUser } from '@repo/lib/actions/get-current-user.ts';
import { Tables } from '@repo/types/entities/supabase.ts';
import { createClient } from '@repo/lib/utils/supabase/server.ts';

export type SetNote = Pick<Tables<"friends_notes">, "friend_id" | "note" | "recipient">

export async function setNoteFriend({
  recipient, friend_id, note, isNoted
}: SetNote & {
  isNoted: boolean // if friend already have a note
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return;
  
  const api = createClient();
  
  if (!isNoted) {
    const { data, error, status } = await api
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
  
  const { data, error, status } = await api
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