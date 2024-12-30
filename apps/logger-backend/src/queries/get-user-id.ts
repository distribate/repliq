import { forumDB } from "../shared/database/forum-db";

export const getUserId = async (nickname: string) => {
  return await forumDB
  .selectFrom("users")
  .select(["id", "nickname"])
  .where("nickname", "=", nickname)
  .executeTakeFirst();
}