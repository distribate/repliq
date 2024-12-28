"use server";

import "server-only";
import { createClient } from "@repo/shared/api/supabase-client.ts";
import { FriendNotesEntity } from "@repo/types/entities/entities-type.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";

export type SetNote = Pick<
  FriendNotesEntity,
  "friend_id" | "note" | "recipient"
>;

type SetNoteFriend = SetNote & {
  isNoted: boolean; // if friend already have a note
};

export async function setNoteFriend({
  recipient,
  friend_id,
  note,
  isNoted,
}: SetNoteFriend) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const api = createClient();

  if (!isNoted) {
    const { data, error, status } = await api.from("friends_notes").insert({
      friend_id: friend_id,
      recipient: recipient,
      initiator: currentUser?.nickname,
      note: note,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { data, status };
  }

  const { data, error, status } = await api
    .from("friends_notes")
    .update({ note: note })
    .eq("recipient", recipient)
    .eq("friend_id", friend_id)
    .eq("initiator", currentUser?.nickname);

  if (error) {
    throw new Error(error.message);
  }

  return { data, status };
}
