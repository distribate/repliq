import { throwError } from "#helpers/throw-error.ts";
import { createComment } from "#lib/queries/comments/create-comment.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const createCommentSchema = z.object({
  parent_type: z.enum(["thread", "post"]),
  parent_id: z.string(),
  content: z.string()
})

export const createCommentRoute = new Hono()
  .post("/create-comment", zValidator("json", createCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const body = await ctx.req.json();
    const result = createCommentSchema.parse(body);

    try {
      const createdComment = await createComment({ ...result, nickname })

      console.log(createdComment)

      if (!createdComment) {
        return ctx.json({ error: "Error creating comment" }, 400);
      }

      return ctx.json({ status: createdComment }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })