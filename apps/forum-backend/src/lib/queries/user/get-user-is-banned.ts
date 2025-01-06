import { forumDB } from "#shared/database/forum-db.ts";

export const getUserIsBanned = async (nickname: string) => {
  const query = await forumDB
    .selectFrom('users_banned')
    .select(forumDB.fn.countAll().as('count'))
    .where('nickname', '=', nickname)
    .executeTakeFirst();

  if (!query) {
    return false;
  }

  return Number(query.count) > 0 ? true : false
}