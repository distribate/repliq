import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type DeleteUserFromBlocked = InitiatorRecipientType

export async function deleteUserFromBlocked({
  initiator, recipient
}: DeleteUserFromBlocked) {
  return await forumDB
    .deleteFrom('users_blocked')
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .execute();
}