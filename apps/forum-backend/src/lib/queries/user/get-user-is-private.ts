import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import { getFriendship } from "../friend/get-friendship";

type GetUserIsPrivate = InitiatorRecipientType

export async function getUserIsPrivate({
  initiator, recipient,
}: GetUserIsPrivate) {
  const q = await forumDB
    .selectFrom("users_settings")
    .select('profile_visibility')
    .where('nickname', '=', recipient)
    .executeTakeFirst();

  if (!q) return false;

  if (initiator === recipient) return false;

  await getFriendship({ initiator, recipient }) ?? false

  return q.profile_visibility === 'all' ? false : true
}