import { forumDB } from "#shared/database/forum-db.ts";
import { getNickname } from "#lib/modules/context.ts";
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
    const { id } = await trx
      .deleteFrom("comments")
      // @ts-expect-error
      .where("id", "=", comment_id)
      .where("parent_type", "=", parent_type)
      .returning("id")
      .executeTakeFirstOrThrow()

    if (id) {
      return { data: id, status: "Created" }
    }

    throw new Error("Error create comment")
  })
}

export const removeCommentRoute = new Hono()
  .delete("/remove-comment", zValidator("json", removeCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const result = removeCommentSchema.parse(await ctx.req.json());

    try {
      const data = await removeComment({ ...result, nickname })

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })