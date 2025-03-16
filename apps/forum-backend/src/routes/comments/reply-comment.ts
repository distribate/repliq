import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { Hono } from "hono";
import { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment.ts"
import { createReplyTransaction } from "#lib/transactions/comment/create-reply-transaction.ts";

export const replyCommentRoute = new Hono()
  .post("/reply-comment", async (ctx) => {
    const result = replyCommentBodySchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const createdReply = await createReplyTransaction({ ...result, nickname })

      if (!createdReply) {
        return ctx.json({ error: "Error creating reply" }, 400);
      }

      return ctx.json({ data: createdReply }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })