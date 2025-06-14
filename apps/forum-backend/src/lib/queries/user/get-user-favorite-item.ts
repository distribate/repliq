import { sqliteDB } from "#shared/database/sqlite-db.ts";

export async function getFavoriteItem(favorite_id: string) {
  return await sqliteDB
    .selectFrom("minecraft_items")
    .select(["image", "id"])
    .where("id", "=", Number(favorite_id))
    .executeTakeFirst();
}