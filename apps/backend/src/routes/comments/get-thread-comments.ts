import { throwError } from '#utils/throw-error.ts';
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getCommentsSchema } from "@repo/types/schemas/comment/get-comments-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import type { CommentWithReplies, GetThreadCommentsResponse } from "@repo/types/entities/thread-comments-types";

type GetThreadComments = {
  limit?: number
  cursor?: string;
  threadId: string;
}

const THREAD_COMMENTS_LIMIT = 16

async function getThreadComments({
  limit: rawLimit, cursor, threadId
}: GetThreadComments): Promise<GetThreadCommentsResponse> {
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
    .orderBy('comments.created_at', 'asc')

  const result = await executeWithCursorPagination(query, {
    perPage: THREAD_COMMENTS_LIMIT,
    after: cursor,
    fields: [
      {
        key: "comment_created_at",
        expression: "comments.created_at",
        direction: "asc"
      },
    ],
    parseCursor: (cursor) => {
      const parsed = {
        comment_created_at: new Date(cursor.comment_created_at),
      }

      return parsed
    },
  });

  const commentsMap = new Map<number, CommentWithReplies>();

  result.rows.forEach(async (row) => {
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

  if (result) {
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
    
    return { ...comment, user};
  });

  return {
    data,
    meta: {
      hasNextPage: result.hasNextPage ?? false,
      hasNextPrev: result.hasPrevPage ?? false,
      startCursor: result.startCursor,
      endCursor: result.endCursor
    }
  }
}

export const getThreadCommentsRoute = new Hono()
  .get("/get-thread-comments/:id", zValidator("query", getCommentsSchema), async (ctx) => {
    const threadId = ctx.req.param("id");
    const { limit, cursor } = getCommentsSchema.parse(ctx.req.query());

    try {
      const threadComments = await getThreadComments({ limit, cursor, threadId });

      return ctx.json(threadComments, 200);
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })