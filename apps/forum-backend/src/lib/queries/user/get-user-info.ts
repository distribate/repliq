import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserInfo(nickname: string) {
  return forumDB
    .selectFrom('users')
    .selectAll()
    .where('nickname', '=', nickname)
    .executeTakeFirstOrThrow();
}