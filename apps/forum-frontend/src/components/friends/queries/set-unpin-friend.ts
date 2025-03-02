import { SetPinFriend } from "./set-pin-friend.ts";
import { forumUserClient } from "@repo/shared/api/forum-client.ts";

export async function setUnpinFriend({ recipient, friend_id }: SetPinFriend) {
  const res = await forumUserClient.user["create-friend-pin"].$post({
    json: { recipient, friend_id, type: "unpin" }
  })

  const data = await res.json();

  if (!data) {
    return null;
  }

  if ("error" in data) {
    return { error: data.error }
  }

  return data
}