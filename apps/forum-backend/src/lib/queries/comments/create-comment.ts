import { createCommentSchema } from "@repo/types/schemas/comment/create-comment-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { z } from "zod/v4"

type CreateComment = z.infer<typeof createCommentSchema> & {
  nickname: string
}

export const createComment = async ({
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