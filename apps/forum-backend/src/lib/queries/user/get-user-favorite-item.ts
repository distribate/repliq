import { forumDB } from "#shared/database/forum-db.ts";

export async function getFavoriteItem(favorite_id: string) {
  return await forumDB
    .selectFrom("config_minecraft_items")
    .select(["image", "id"])
    .where("id", "=", favorite_id)
    .executeTakeFirst();
}