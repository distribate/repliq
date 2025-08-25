import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

async function getLastCreatedComments() {
  return forumDB
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
    .innerJoin("users", "users.nickname", "comments.nickname")
    .select([
      "comments.nickname",
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
}

export const getLastCommentsRoute = new Hono()
  .get("/get-last-comments", async (ctx) => {

    try {
      let lastComments = await getLastCreatedComments();

      lastComments = lastComments.map(comment => ({
        ...comment,
        content: comment.content.slice(0, 28)
      }))

      return ctx.json({ data: lastComments }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })