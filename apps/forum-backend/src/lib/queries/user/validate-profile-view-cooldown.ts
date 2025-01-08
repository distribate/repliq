import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import dayjs from "dayjs";

export async function validateProfileViewCoolDown({
  initiator, recipient
}: InitiatorRecipientType) {
  const query = await forumDB
    .selectFrom('profile_views')
    .select(forumDB.fn.countAll().as('count'))
    .where('initiator', '=', initiator)
    .where('recipient', '=', recipient)
    .where("created_at", '>=', dayjs().subtract(1, 'day').toDate())
    .$castTo<{ count: number }>()
    .executeTakeFirst();

  if (!query) {
    return false
  }

  return query.count === 0;
}