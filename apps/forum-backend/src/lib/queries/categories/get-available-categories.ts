import { forumDB } from "#shared/database/forum-db.ts"
import { sql } from "kysely";

export const getAvailableCategories = async () => {
  return await forumDB
    .selectFrom("category")
    .select([
      "title",
      "available",
      "description",
      sql`CAST(id AS INT)`.as("id")
    ])
    .execute();
}