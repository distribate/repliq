import type { createCommentSchema } from "#routes/comments/create-comment.ts"
import { forumDB } from "#shared/database/forum-db.ts"
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment"
import type { z } from "zod"

type CreateComment = z.infer<typeof createCommentSchema> & {
  nickname: string
}

type CreateReply = z.infer<typeof replyCommentBodySchema> & {
  nickname: string
}

export async function createReply({
  content, recipient_comment_id, parent_id, parent_type, nickname
}: CreateReply) {
  const createdRepliedComments = await forumDB.transaction().execute(async (trx) => {
    const comment = await trx
      .insertInto('comments')
      .values({ user_nickname: nickname, content, parent_type, parent_id })
      .returning(['id', 'user_nickname', 'content', 'created_at', 'updated_at', 'is_updated'])
      .executeTakeFirstOrThrow();

    return await trx
      .insertInto('comments_replies')
      .values({
        initiator_comment_id: comment.id,
        recipient_comment_id,
      })
      .returning("id")
      .executeTakeFirstOrThrow();
  })

  return createdRepliedComments;
}

export const createComment = async ({
  content, nickname, parent_id, parent_type
}: CreateComment) => {
  const createdComment = await forumDB.transaction().execute(async (trx) => {
    switch (parent_type) {
      case "post":
        return "Not supported"
      case "thread":
        const validateThreadCommentable = await trx
          .selectFrom("threads")
          .select("is_comments")
          .where("id", "=", parent_id)
          .executeTakeFirstOrThrow()

        if (!validateThreadCommentable) {
          return "Not commentable"
        }
        break
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