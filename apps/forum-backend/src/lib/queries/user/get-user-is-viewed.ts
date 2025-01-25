import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type GetUserIsViewed = InitiatorRecipientType

export async function getUserIsViewed({
  initiator, recipient,
}: GetUserIsViewed) {
  const query = await forumDB
    .selectFrom("profile_views")
    .select(forumDB.fn.countAll().as('count'))
    .where("initiator", "=", initiator)
    .where("recipient", "=", recipient)
    .where("created_at", '>=', new Date(new Date().setDate(new Date().getDate() - 1)))
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  if (!query) {
    return false
  }

  return query.count > 0 ? true : false
}