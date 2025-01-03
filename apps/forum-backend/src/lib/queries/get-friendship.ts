import { forumDB } from "#shared/database/forum-db.ts";

export async function getFriendship(currentUserNickname: string, requestedUserNickname: string) {
    return await forumDB
    .selectFrom('users_friends')
    .select('id')
    .where((qb) =>
      qb
        .or([
          qb('user_1', '=', currentUserNickname),
          qb('user_2', '=', currentUserNickname)
        ])
    )
    .where((qb) =>
      qb.or([
        qb('user_1', '=', requestedUserNickname),
        qb('user_2', '=', requestedUserNickname)
      ])
    )
    .executeTakeFirst();
  }