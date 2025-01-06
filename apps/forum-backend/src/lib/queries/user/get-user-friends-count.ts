import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserFriendsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("users_friends")
    .select(forumDB.fn.countAll().as('count'))
    .where((eb) =>
      eb.or([
        eb('user_1', '=', nickname),
        eb('user_2', '=', nickname),
      ]),
    )
    .$narrowType<{ count: number }>()
    .executeTakeFirst();

  if (!query) {
    return 0
  }
  
  return query.count
}