import { forumDB } from "../shared/database/forum-db";

export async function checkUserExists(nickname: string) {
  const exists = await forumDB
    .selectFrom("users")
    .select("nickname")
    .where("nickname", "=", nickname)
    .executeTakeFirst();

  return Boolean(exists)
}