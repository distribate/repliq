import { throwError } from '#utils/throw-error.ts';
import { getNickname } from "#lib/modules/context.ts";
import { Hono } from "hono";
import { forumDB } from "#shared/database/forum-db.ts";
import { replyCommentBodySchema } from "@repo/types/routes-types/reply-comment";
import * as z from "zod";

type CreateReply = z.infer<typeof replyCommentBodySchema> & {
  nickname: string
}

async function createReplyTransaction({
  content, recipient_comment_id, parent_id, parent_type, nickname
}: CreateReply) {
  const createdRepliedComments = await forumDB.transaction().execute(async (trx) => {
    const validateThreadCommentable = await trx
      .selectFrom("threads")
      .select("is_comments")
      .where("id", "=", parent_id)
      .executeTakeFirstOrThrow()

    if (!validateThreadCommentable) {
      throw new Error("Not commentable")
    }

    const comment = await trx
      .insertInto('comments')
      .values({
        nickname,
        content,
        parent_type,
        parent_id
      })
      .returning(eb => [
        'id',
        'nickname',
        'content',
        'created_at',
        'updated_at',
        'is_updated',
        eb.selectFrom('users')
          .select('users.avatar')
          .whereRef('users.nickname', '=', 'comments.nickname')
          .as('avatar')
      ])
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

  return { data: createdRepliedComments.comment, status: "Created" }
}

export const replyCommentRoute = new Hono()
  .post("/reply-comment", async (ctx) => {
    const result = replyCommentBodySchema.parse(await ctx.req.json());
    const nickname = getNickname()

    try {
      const data = await createReplyTransaction({ ...result, nickname })

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })