import { forumDB } from "#shared/database/forum-db.ts";


type GetFriendshipType = InitiatorRecipientType

export async function getFriendship({
  initiator, recipient
}: GetFriendshipType) {
  return forumDB
    .selectFrom('users_friends')
    .select('id')
    .where((qb) =>
      qb
        .or([
          qb('user_1', '=', initiator),
          qb('user_2', '=', initiator)
        ])
    )
    .where((qb) =>
      qb.or([
        qb('user_1', '=', recipient),
        qb('user_2', '=', recipient)
      ])
    )
    .executeTakeFirst();
}