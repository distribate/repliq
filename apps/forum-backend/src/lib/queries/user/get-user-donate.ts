import { forumDB } from "#shared/database/forum-db.ts";

export const getUserDonate = async (nickname: string) => {
  return await forumDB
    .selectFrom('users')
    .select('donate')
    .where('nickname', '=', nickname)
    .executeTakeFirstOrThrow();
}