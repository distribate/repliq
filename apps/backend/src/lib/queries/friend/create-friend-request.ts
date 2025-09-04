import { forumDB } from "#shared/database/forum-db.ts";

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