import { throwError } from '#utils/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import type { CommentWithReplies, GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types";
import * as z from 'zod';

const THREAD_COMMENTS_LIMIT = 16

async function getThreadComments(
  threadId: string,
  { limit: rawLimit, cursor }: z.infer<typeof getCommentsSchema>
): Promise<GetThreadCommentsResponse> {
  const direction = "asc";

  const query = forumDB
    .selectFrom('comments')
    .leftJoin('comments_replies', 'comments.id', 'comments_replies.initiator_comment_id')
    .leftJoin('comments as replied_comment', 'comments_replies.recipient_comment_id', 'replied_comment.id')
    .select([
      'comments.id as comment_id',
      'comments.created_at as comment_created_at',
      'comments.nickname as comment_nickname',
      'comments.content as comment_content',
      'comments.updated_at as comment_updated_at',
      'comments.is_updated as comment_is_updated',
      'comments_replies.initiator_comment_id as reply_initiator_comment_id',
      'comments_replies.recipient_comment_id as reply_recipient_comment_id',
      'replied_comment.id as replied_comment_id',
      'replied_comment.created_at as replied_comment_created_at',
      'replied_comment.nickname as replied_comment_nickname',
      'replied_comment.content as replied_comment_content',
      'replied_comment.updated_at as replied_comment_updated_at',
      'replied_comment.is_updated as replied_comment_is_updated',
    ])
    .where('comments.parent_id', '=', threadId)
    .where("comments.parent_type", "=", "thread")

  const res = await executeWithCursorPagination(query, {
    perPage: THREAD_COMMENTS_LIMIT,
    after: cursor,
    fields: [
      {
        key: "comment_created_at",
        expression: "comments.created_at",
        direction
      },
    ],
    parseCursor: (cursor) => ({
      comment_created_at: new Date(cursor.comment_created_at)
    }),
  });

  const commentsMap = new Map<number, CommentWithReplies>();

  res.rows.forEach(async (row) => {
    const commentId = Number(row.comment_id);
    const createdAt = row.comment_created_at.toString();
    const initialCommentUpdatedAt = row.comment_updated_at ? row.comment_updated_at.toString() : null;

    if (!commentsMap.has(commentId)) {
      commentsMap.set(commentId, {
        id: commentId,
        created_at: createdAt,
        user: {
          nickname: row.comment_nickname,
          avatar: null
        },
        content: row.comment_content,
        updated_at: initialCommentUpdatedAt,
        is_updated: row.comment_is_updated,
        replied: null,
      });
    }

    if (row.replied_comment_id) {
      const repliedComment = {
        id: Number(row.replied_comment_id),
        created_at: row.replied_comment_created_at!.toString(),
        user: {
          nickname: row.replied_comment_nickname!,
          avatar: null,
        },
        content: row.replied_comment_content!,
        updated_at: row.replied_comment_updated_at ? row.replied_comment_updated_at.toString() : null,
        is_updated: row.replied_comment_is_updated ?? false,
      };

      const comment = commentsMap.get(commentId);

      if (comment) {
        comment.replied = repliedComment;
      }
    }
  });

  let data = Array.from(commentsMap.values())

  let creatorNicknames: string[] = []

  if (res) {
    creatorNicknames = [...new Set(data.map(a => a.user.nickname!))];
  }

  const users = await forumDB
    .selectFrom("users")
    .select(["nickname", "avatar"])
    .where("users.nickname", "in", creatorNicknames)
    .execute();

  const usersByNickname = new Map(users.map(user => [user.nickname, user]));

  data = data.map(comment => {
    const user = usersByNickname.get(comment.user.nickname)!;

    return { ...comment, user };
  });

  return {
    data,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasNextPrev: res.hasPrevPage ?? false,
      startCursor: res.startCursor,
      endCursor: res.endCursor
    }
  }
}

export const getThreadCommentsRoute = new Hono()
  .get("/comments/:id", zValidator("query", getCommentsSchema), async (ctx) => {
    const id = ctx.req.param("id");
    const result = getCommentsSchema.parse(ctx.req.query());

    try {
      const data = await getThreadComments(id, result);

      return ctx.json({ data }, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })