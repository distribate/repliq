import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type GetFriendId = InitiatorRecipientType & {
  friend_id: string
}

export const getFriendId = async ({
  friend_id, initiator, recipient
}: GetFriendId) => {
  return forumDB
    .selectFrom("friends_notes")
    .select("id")
    .where("recipient", "=", recipient)
    .where("friend_id", "=", friend_id)
    .where("initiator", "=", initiator)
    .executeTakeFirstOrThrow();
}