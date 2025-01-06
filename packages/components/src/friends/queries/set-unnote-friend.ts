import { SetNote } from "./set-note-friend.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export async function setUnNoteFriend({
  recipient,
  friend_id,
}: Omit<SetNote, "note">) {
  const res = await forumUserClient().user["delete-friend-note"].$delete({
    json: {
      recipient,
      friend_id,
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return { data, friend_id };
}