import { forumDB } from "#shared/database/forum-db.ts"

export async function validateAvailabilityByCurrency(currency: string) {
  const query = await forumDB
    .selectFrom("landing_currencies")
    .select("id")
    .where("isAvailable", "=", true)
    .where("value", "=", currency)
    .executeTakeFirst()

  if (!query) {
    return false
  }

  return true
}