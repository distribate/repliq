import { forumDB } from "../../shared/database/forum-db";

export const getSession = async (session_id: string) => {
  return await forumDB
  .selectFrom("users_session")
  .innerJoin("users", "users.id", "users_session.user_id")
  .select([
    "users_session.session_id",
    "users_session.user_id",
    "users_session.expires_at",
    "users.id as userId",
    "users.nickname as nickname",
    "users.uuid as uuid",
  ])
  .where("users_session.session_id", "=", session_id)
  .executeTakeFirst();
}