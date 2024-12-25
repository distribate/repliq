import { forumDB } from "@repo/shared/db/forum-db"

export const getAdmins = async (telegramId: number) => {
  return await forumDB
  .selectFrom("admins")
  .select("telegram_id")
  .where("telegram_id", "=", String(telegramId))
  .execute()
}