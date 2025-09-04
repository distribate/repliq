import { forumDB } from "#shared/database/forum-db.ts";
import type { friendPinSchema } from "@repo/types/schemas/friend/friend-pin-schema";
import * as z from "zod";

type CreateFriendPin = Omit<z.infer<typeof friendPinSchema>, "type"> 
  & Pick<InitiatorRecipientType, "initiator">

export async function createFriendPin({
  friend_id, recipient, initiator
}: CreateFriendPin) {
  return forumDB
    .insertInto('friends_pinned')
    .values({
      initiator,
      recipient,
      friend_id
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}