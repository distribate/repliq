import { throwError } from "#helpers/throw-error.ts";
import { createComment } from "#lib/queries/comments/create-comment.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCommentSchema } from "@repo/types/schemas/comment/create-comment-schema.ts";

export const createCommentRoute = new Hono()
  .post("/create-comment", zValidator("json", createCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const body = await ctx.req.json();
    const result = createCommentSchema.parse(body);

    try {
      const createdComment = await createComment({ ...result, nickname })

      if (!createdComment) {
        return ctx.json({ error: "Error creating comment" }, 400);
      }

      return ctx.json({ status: createdComment }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })