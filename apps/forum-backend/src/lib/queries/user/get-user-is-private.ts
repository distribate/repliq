import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";
import { getFriendship } from "../friend/get-friendship";

type GetUserIsPrivate = InitiatorRecipientType

export async function getUserIsPrivate({
  initiator, recipient,
}: GetUserIsPrivate) {
  const query = await forumDB
    .selectFrom("users_settings")
    .select('profile_visibility')
    .where('nickname', '=', recipient)
    .executeTakeFirstOrThrow();

  if (initiator === recipient) return false;

  const friendShip = await getFriendship({
    initiator, recipient
  })

  if (friendShip) return false;

  return query.profile_visibility === 'all' ? false : true
}