"use server";

import "server-only";
import { SetPinFriend } from "./set-pin-friend.ts";
import { getCurrentSession } from "@repo/lib/actions/get-current-session.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export async function setUnpinFriend({ recipient, friend_id }: SetPinFriend) {
  const { user: currentUser } = await getCurrentSession();
  if (!currentUser) return;

  const res = await forumUserClient.user["create-friend-pin"].$post({
    json: {
      recipient,
      friend_id,
      initiator: currentUser.nickname,
      type: "unpin"
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  const { status } = data

  return { status, friend_id };
}