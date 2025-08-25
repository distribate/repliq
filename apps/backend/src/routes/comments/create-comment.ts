import { throwError } from '#utils/throw-error.ts';
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
  return forumDB.transaction().execute(async (trx) => {
    const validateThreadCommentable = await trx
      .selectFrom("threads")
      .select("is_comments")
      .where("id", "=", parent_id)
      .executeTakeFirstOrThrow()

    if (!validateThreadCommentable) {
      throw new Error("Not commentable")
    }

    const comment = await trx
      .insertInto("comments")
      .values({
        content,
        nickname,
        parent_id,
        parent_type
      })
      .returning(eb => [
        "id",
        "created_at",
        "content",
        "parent_id",
        'parent_type',
        "updated_at",
        "is_updated",
        "nickname",
        eb.selectFrom('users')
          .select('users.avatar')
          .whereRef('users.nickname', '=', 'comments.nickname')
          .as('avatar')
      ])
      .executeTakeFirstOrThrow()

    return { data: comment, status: "Created" }
  })
}

export const createCommentRoute = new Hono()
  .post("/create-comment", zValidator("json", createCommentSchema), async (ctx) => {
    const nickname = getNickname()
    const result = createCommentSchema.parse(await ctx.req.json());

    try {
      const data = await createComment({ ...result, nickname })

      return ctx.json(data, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })