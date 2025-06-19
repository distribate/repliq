import { forumDB } from "#shared/database/forum-db.ts";
import type { InitiatorRecipientType } from "#types/initiator-recipient-type.ts";

type ValidateFriendship = InitiatorRecipientType

export async function getUserIsFriend({
  initiator, recipient
}: ValidateFriendship): Promise<boolean> {
  const friendships = await forumDB
  .selectFrom('users_friends')
  .select(
    forumDB.fn.count('id').as('count')
  )
  .where((eb) =>
    eb.or([
      eb('user_1', '=', initiator),
      eb('user_2', '=', initiator),
    ]),
  )
  .where((eb) =>
    eb.or([
      eb('user_1', '=', recipient),
      eb('user_2', '=', recipient),
    ]),
  )
  .$castTo<{ count: number }>()
  .executeTakeFirst();
  
  if (!friendships) return false;

  return friendships.count > 0 ? true : false
}