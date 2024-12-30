import { forumDB } from "../shared/database/forum-db";

export const addNewAdmin = async (userId: string) => {
  return await forumDB
  .insertInto("admins")
  .values({ user_id: userId })
  .execute();
}

export const deleteAdmin = async (userId: string) => {
  return await forumDB
  .deleteFrom("admins")
  .where("user_id", "=", userId)
  .execute();
}
