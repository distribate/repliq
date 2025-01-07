import { createCommentSchema } from "@repo/types/schemas/comment/create-comment-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import type { z } from "zod"

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
      return "Not commentable"
    }

    const comment = await trx
      .insertInto("comments")
      .values({
        content,
        user_nickname: nickname,
        parent_id,
        parent_type
      })
      .returning("id")
      .executeTakeFirstOrThrow()

    if (comment.id) {
      return "Created"
    }
  })

  return createdComment
}