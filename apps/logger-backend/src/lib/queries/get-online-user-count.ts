import { forumDB } from "../../shared/database/forum-db"

export async function getOnlineUsersCount() {
  const query = await forumDB
    .selectFrom("users_status")
    .select("id")
    .where("created_at", ">", new Date(Date.now() - 5 * 60 * 1000))
    .execute()

  return query.length
}