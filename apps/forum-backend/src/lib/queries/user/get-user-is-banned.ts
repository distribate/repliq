import { forumDB } from "#shared/database/forum-db.ts";

export const getUserIsBanned = async (nickname: string) => {
  const query = await forumDB
    .selectFrom('users_banned')
    .selectAll()
    .$narrowType<{ count: number }>()
    .where('nickname', '=', nickname)
    .executeTakeFirst();

  if (!query) {
    return null;
  }

  return query
}