import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { sql } from "kysely";

async function getLastComments() {
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
    .select([
      "comments.user_nickname",
      "comments.parent_id",
      "comments.parent_type",
      "comments.content",
      "comments.created_at",
      "threads.title"
    ])
    .where("comments.parent_type", "=", "thread")
    .orderBy("comments.created_at", "desc")
    .limit(6)
    .execute()

  return query;
}

export const getLastCommentsRoute = new Hono()
  .get("/get-last-comments", async (ctx) => {

    try {
      let lastComments = await getLastComments();

      lastComments = lastComments.map(comment => ({
        ...comment,
        content: comment.content.slice(0, 28)
      }))

      return ctx.json({ data: lastComments }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })