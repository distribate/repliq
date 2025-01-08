import { forumDB } from "#shared/database/forum-db.ts";

export async function getUserNickname(uuid: string) {
  return await forumDB
    .selectFrom("users")
    .select('nickname')
    .where('uuid', '=', uuid)
    .executeTakeFirst()
}