import { throwError } from "#helpers/throw-error.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment.ts"
import { createReply } from "#lib/queries/comments/create-comment.ts";

export const replyCommentRoute = new Hono()
  .post("/reply-comment", async (ctx) => {
    const body = await ctx.req.json();
    const result = replyCommentBodySchema.parse(body);
    const nickname = getNickname()

    try {
      const createdReply = await createReply({
        ...result, nickname
      })

      if (!createdReply) {
        return ctx.json({ error: "Error creating reply" }, 400);
      }

      return ctx.json({ status: "Created" }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  }
  )