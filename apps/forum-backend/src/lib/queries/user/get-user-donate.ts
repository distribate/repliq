import { forumDB } from "#shared/database/forum-db.ts";

export const getUserDonate = async (nickname: string) => {
  const query = await forumDB
    .selectFrom('users_subs')
    .select('id')
    .where('nickname', '=', nickname)
    .executeTakeFirst();

  return Boolean(query?.id)
}