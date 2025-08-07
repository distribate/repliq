import { throwError } from '@repo/lib/helpers/throw-error.ts';
import { getNickname } from "#utils/get-nickname-from-storage.ts";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createCommentSchema } from "@repo/types/schemas/comment/create-comment-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import * as z from "zod"

type CreateComment = z.infer<typeof createCommentSchema> & {
  nickname: string
}

const createComment = async ({
  content, nickname, parent_id, parent_type
}: CreateComment) => {
  const createdComment = await forumDB.transaction().execute(async (trx) => {
    const validateThreadCommentable = await trx
      .selectFrom("threads")
      .select("is_comments")
      .where("id", "=", parent_id)
      .executeTakeFirstOrThrow()

    if (!validateThreadCommentable) {
      return { data: null, status: "Not commentable" }
    }

    const comment = await trx
      .insertInto("comments")
      .values({
        content,
        user_nickname: nickname,
        parent_id,
        parent_type
      })
      .returningAll()
      .executeTakeFirstOrThrow()

    if (comment.id) {
      return { data: comment, status: "Created" }
    }
  })

  return createdComment
}

export const createCommentRoute = new Hono()
  .post("/create-comment", zValidator("json", createCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const result = createCommentSchema.parse(await ctx.req.json());

    try {
      const createdComment = await createComment({ ...result, nickname })

      if (!createdComment) {
        return ctx.json({ error: "Error creating comment" }, 400);
      }

      return ctx.json({ data: createdComment }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })