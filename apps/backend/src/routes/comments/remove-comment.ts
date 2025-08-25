import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import * as z from "zod";

export const removeCommentSchema = z.object({
  parent_type: z.enum(["thread", "post"]),
  comment_id: z.number(),
})

type RemoveComment = z.infer<typeof removeCommentSchema> & {
  nickname: string
}

async function removeComment({ parent_type, comment_id }: RemoveComment) {
  return forumDB.transaction().execute(async (trx) => {
    const comment = await trx
      .deleteFrom("comments")
      // @ts-expect-error
      .where("id", "=", comment_id)
      .where("parent_type", "=", parent_type)
      .returning("id")
      .executeTakeFirstOrThrow()

    if (comment.id) {
      return { data: comment, status: "Created" }
    }
  })
}

export const removeCommentRoute = new Hono()
  .delete("/remove-comment", zValidator("json", removeCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const result = removeCommentSchema.parse(await ctx.req.json());

    try {
      const deletedComment = await removeComment({ ...result, nickname })

      if (!deletedComment) {
        return ctx.json({ error: "Error creating comment" }, 400);
      }

      return ctx.json({ data: deletedComment }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })