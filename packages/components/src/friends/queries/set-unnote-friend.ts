"use server";

import "server-only";
import { SetNote } from "./set-note-friend.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export async function setUnNoteFriend({
  recipient,
  friend_id,
}: Omit<SetNote, "note">) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const res = await forumUserClient.user["delete-friend-note"].$delete({
    json: {
      recipient,
      friend_id,
      initiator: currentUser.nickname
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  return { data, friend_id };
}