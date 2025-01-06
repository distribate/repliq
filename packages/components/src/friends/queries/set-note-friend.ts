import { FriendNotesEntity } from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export type SetNote = Pick<
  FriendNotesEntity,
  "friend_id" | "note" | "recipient"
>;

export async function setNoteFriend({
  recipient, friend_id, note,
}: SetNote) {
  const res = await forumUserClient().user["create-friend-note"].$post({
    json: {
      recipient,
      friend_id,
      message: note
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  const { note: newNote, status } = data;

  return { status, note: newNote, friend_id }
}