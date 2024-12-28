import { forumDB } from "../shared/db.ts"

export const getAdmins = async (telegramId: number) => {
  return await forumDB
  .selectFrom("admins")
  .select("telegram_id")
  .where("telegram_id", "=", String(telegramId))
  .execute()
}