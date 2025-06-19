import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export async function getLastCreatedComments() {
  const query = await forumDB
    .selectFrom("comments")
    .innerJoin(
      "threads",
      (join) =>
        join.on(
          sql`CAST(comments.parent_id AS UUID)`,
          "=",
          sql`threads.id`
        )
    )
    .innerJoin("users", "users.nickname", "comments.user_nickname")
    .select([
      "comments.user_nickname",
      "comments.parent_id",
      "comments.parent_type",
      "comments.content",
      "comments.created_at",
      "threads.title",
      "users.avatar"
    ])
    .where("comments.parent_type", "=", "thread")
    .orderBy("comments.created_at", "desc")
    .limit(6)
    .execute()

  return query;
}