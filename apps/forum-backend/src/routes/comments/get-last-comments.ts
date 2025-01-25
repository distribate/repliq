import { getLastCreatedComments } from "#lib/queries/comments/get-last-created-comments.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

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