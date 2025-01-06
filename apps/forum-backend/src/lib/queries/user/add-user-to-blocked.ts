import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type AddUserToBlocked = InitiatorRecipientType

export async function addUserToBlocked({
  initiator, recipient
}: AddUserToBlocked) {
  return await forumDB
    .insertInto('users_blocked')
    .values({ initiator, recipient })
    .returningAll()
    .executeTakeFirstOrThrow();
}