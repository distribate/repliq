import { forumDB } from "#shared/database/forum-db.ts";
import type { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment";
import type { z } from "zod";

type CreateReply = z.infer<typeof replyCommentBodySchema> & {
  nickname: string
}

export async function createReplyTransaction({
  content, recipient_comment_id, parent_id, parent_type, nickname
}: CreateReply) {
  const createdRepliedComments = await forumDB.transaction().execute(async (trx) => {
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