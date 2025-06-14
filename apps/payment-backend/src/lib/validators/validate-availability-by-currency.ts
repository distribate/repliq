import { forumDB } from "#shared/database/forum-db.ts"
import { sqliteDB } from "../../shared/database/sqlite-db"

export async function validateAvailabilityByCurrency(currency: string) {
  const query = await sqliteDB
    .selectFrom("currencies")
    .select("id")
    .where("isAvailable", "=", 1)
    .where("value", "=", currency)
    .executeTakeFirst()

  if (!query) {
    return false
  }

  return true
}