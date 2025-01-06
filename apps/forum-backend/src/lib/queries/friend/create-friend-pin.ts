import type { createFriendPinSchema } from "#routes/friend/create-friend-pin.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import type { z } from "zod";

type CreateFriendPin = Omit<z.infer<typeof createFriendPinSchema>, "type"> 
  & Pick<InitiatorRecipientType, "initiator">

export async function createFriendPin({
  friend_id, recipient, initiator
}: CreateFriendPin) {
  return await forumDB
    .insertInto('friends_pinned')
    .values({
      initiator,
      recipient,
      friend_id
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}