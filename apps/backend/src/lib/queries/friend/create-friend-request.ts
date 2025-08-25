import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type CreateFriendRequest = InitiatorRecipientType

export async function createFriendRequest({
  initiator, recipient
}: CreateFriendRequest) {
  return forumDB
    .insertInto('friends_requests')
    .values({
      initiator, recipient,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}