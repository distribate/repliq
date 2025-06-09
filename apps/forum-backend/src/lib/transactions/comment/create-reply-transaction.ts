import { forumDB } from "#shared/database/forum-db.ts";
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment";
import type { z } from "zod/v4";

type CreateReply = z.infer<typeof replyCommentBodySchema> & {
  nickname: string
}

export async function createReplyTransaction({
  content, recipient_comment_id, parent_id, parent_type, nickname
}: CreateReply) {
  const createdRepliedComments = await forumDB.transaction().execute(async (trx) => {
    const validateThreadCommentable = await trx
      .selectFrom("threads")
      .select("is_comments")
      .where("id", "=", parent_id)
      .executeTakeFirstOrThrow()

    if (!validateThreadCommentable) {
      return { data: null, status: "Not commentable" }
    }

    const comment = await trx
      .insertInto('comments')
      .values({
        user_nickname: nickname,
        content,
        parent_type,
        parent_id
      })
      .returning(['id', 'user_nickname', 'content', 'created_at', 'updated_at', 'is_updated'])
      .executeTakeFirstOrThrow();

    const replies = await trx
      .insertInto('comments_replies')
      .values({
        initiator_comment_id: comment.id,
        recipient_comment_id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return { comment, replies }
  })

  return {
    data: createdRepliedComments.comment,
    status: "Created"
  }
}