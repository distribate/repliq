import { forumDB } from "#shared/database/forum-db.ts";
import * as z from "zod";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import type { friendPinSchema } from "@repo/types/schemas/friend/friend-pin-schema";

type DeleteFriendPin = z.infer<typeof friendPinSchema> 
  & Pick<InitiatorRecipientType, "initiator">

export async function deleteFriendPin({
  friend_id, recipient, initiator
}: DeleteFriendPin) {
  return forumDB
    .deleteFrom('friends_pinned')
    .where("friend_id", "=", friend_id)
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .execute();
}