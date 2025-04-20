import { forumDB } from "../../shared/database/forum-db";

export const getSession = async (session_id: string) => {
  return forumDB
    .selectFrom("users_session")
    .innerJoin("users", "users.nickname", "users_session.nickname")
    .select([
      "users_session.session_id",
      "users_session.expires_at",
      "users.id as userId",
      "users.uuid as uuid",
      "users_session.nickname"
    ])
    .where("users_session.session_id", "=", session_id)
    .executeTakeFirst();
}