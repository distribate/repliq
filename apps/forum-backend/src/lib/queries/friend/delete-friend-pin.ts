import type { createFriendPinSchema } from "#routes/friend/create-friend-pin.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { z } from "zod";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type DeleteFriendPin = z.infer<typeof createFriendPinSchema> 
  & Pick<InitiatorRecipientType, "initiator">

export async function deleteFriendPin({
  friend_id, recipient, initiator
}: DeleteFriendPin) {
  return await forumDB
    .deleteFrom('friends_pinned')
    .where("friend_id", "=", friend_id)
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .execute();
}