import { z } from 'zod';
import { forumDB } from '#shared/database/forum-db.ts';
import { sql } from 'kysely';
import type { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { getUserIsFriend } from './get-user-is-friend';
import { executeWithCursorPagination } from 'kysely-paginate';

type GetPosts = z.infer<typeof getUserPostsSchema> & {
  requestedUserNickname: string;
  currentUserNickname: string,
}

export async function getUserPosts({
  ascending, filteringType, currentUserNickname, requestedUserNickname, cursor
}: GetPosts): Promise<GetUserPostsResponse | null> {
  const isFriend = await getUserIsFriend({
    recipient: requestedUserNickname, initiator: currentUserNickname
  });

  const asc = ascending ? "asc" : "desc";

  const query = forumDB
    .selectFrom("posts_users")
    .innerJoin("posts", "posts.id", "posts_users.post_id")
    .leftJoin("posts_views", "posts_views.post_id", "posts.id")
    .leftJoin("posts_comments", "posts_comments.post_id", "posts.id")
    .select([
      "posts.id",
      "posts.content",
      "posts.created_at",
      "posts.visibility",
      "posts.isComments",
      "posts.isPinned",
      "posts.isUpdated",
      "posts_users.nickname as nickname",
      sql`COUNT(DISTINCT posts_comments.id)`.as("comments_count"),
      sql`COUNT(DISTINCT posts_views.id)`.as("views_count"),
      sql`COALESCE(BOOL_OR(posts_views.nickname = ${currentUserNickname}), false)`.as("isViewed")
    ])
    .$castTo<{
      comments_count: number;
      views_count: number;
      isViewed: boolean;
      nickname: string;
      id: string;
      content: string;
      created_at: string | Date;
      visibility: "only" | "all" | "friends";
      isComments: boolean;
      isPinned: boolean;
      isUpdated: boolean;
    }>()
    .where("posts_users.nickname", "=", requestedUserNickname)
    .where((eb) => {
      if (requestedUserNickname === currentUserNickname) {
        return eb.or([
          eb("visibility", "=", "only"),
          eb("visibility", "=", "friends"),
          eb("visibility", "=", "all"),
        ]);
      } else if (isFriend) {
        return eb.or([
          eb("visibility", "=", "all"),
          eb("visibility", "=", "friends"),
        ]);
      } else {
        return eb("visibility", "=", "all");
      }
    })
    .groupBy([
      "posts.id",
      "posts.content",
      "posts.created_at",
      "posts.visibility",
      "posts.isComments",
      "posts.isPinned",
      "posts.isUpdated",
      "posts_users.nickname",
    ])

  switch (filteringType) {
    case "created_at":
      const withCreatedAt = await executeWithCursorPagination(query, {
        perPage: 8,
        after: cursor,
        fields: [
          {
            key: "created_at",
            direction: asc,
            expression: "created_at",
          }
        ],
        parseCursor: (cursor) => ({
          created_at: new Date(cursor.created_at),
        })
      });

      return {
        data: withCreatedAt.rows ?? [],
        meta: {
          hasNextPage: withCreatedAt.hasNextPage ?? false,
          hasPrevPage: withCreatedAt.hasPrevPage ?? false,
          startCursor: withCreatedAt.startCursor ?? null,
          endCursor: withCreatedAt.endCursor ?? null
        }
      }
    case "views_count":
      const withViewsCount = await executeWithCursorPagination(query, {
        perPage: 8,
        after: cursor,
        fields: [
          {
            key: "views_count",
            direction: asc,
            // @ts-ignore
            expression: "views_count",
          }
        ],
        parseCursor: (cursor) => ({
          // @ts-ignore
          views_count: Number(cursor.views_count),
        })
      });

      return {
        data: withViewsCount.rows ?? [],
        meta: {
          hasNextPage: withViewsCount.hasNextPage ?? false,
          hasPrevPage: withViewsCount.hasPrevPage ?? false,
          startCursor: withViewsCount.startCursor ?? null,
          endCursor: withViewsCount.endCursor ?? null
        }
      }
  }
}