import { FriendPinnedEntity } from "@repo/types/entities/entities-type.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

export type SetPinFriend = Pick<FriendPinnedEntity, "friend_id" | "recipient">;

export async function setPinFriend({ recipient, friend_id }: SetPinFriend) {
  const res = await forumUserClient.user["create-friend-pin"].$post({
    json: {
      recipient,
      friend_id,
      type: "pin"
    }
  })

  const data = await res.json();

  if ("error" in data) {
    return { error: data.error }
  }

  const { status } = data;

  return { status, friend_id };
}