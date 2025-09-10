import { forumDB } from "../../shared/database/forum-db"

export async function validateAdminRequest(telegramId: number): Promise<boolean> {
  const query = await forumDB
    .selectFrom("admins")
    .select("nickname")
    .where("telegram_id", "=", telegramId.toString())
    .executeTakeFirst()

  return Boolean(query?.nickname)
}