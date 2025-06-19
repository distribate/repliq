import type { getCategoryThreadsSchema } from "#routes/categories/get-category-threads.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import type { z } from "zod/v4";
import { sql } from "kysely";

type ThreadsFromCategories = z.infer<typeof getCategoryThreadsSchema> & {
  id: string
}

export async function getThreadsCategories({
  id, ascending, limit, cursor
}: ThreadsFromCategories) {
  let query = forumDB
    .selectFrom("threads")
    .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
    .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
    .innerJoin("users", "threads_users.user_nickname", "users.nickname")
    .select(eb => [
      "threads.id",
      "threads.title",
      "threads.created_at",
      "threads.updated_at",
      "threads.visibility",
      'threads.is_comments',
      "threads.description",
      "users.nickname",
      "users.name_color",
      "users.avatar",
      eb.cast<string>('threads.created_at', 'text').as('created_at'),
      sql<number>`COALESCE(COUNT(threads_views.id), 0)`.as('views_count'),
      sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('comments_count'),
    ])
    .where("threads.category_id", "=", id)
    .orderBy("threads.created_at", ascending ? "asc" : "desc")
    .groupBy([
      "threads.id", 
      "threads.title",
      "threads.description",
      "threads.created_at",
      "users.nickname",
      "users.name_color",
      "users.avatar",
      "threads.is_comments",
    ])

  const res = await executeWithCursorPagination(query, {
    after: cursor,
    perPage: limit ?? 12,
    fields: [
      {
        key: "created_at",
        direction: ascending ? "asc" : "desc",
        expression: "threads.created_at",
      }
    ],
    parseCursor: (cursor) => {
      return {
        created_at: new Date(cursor.created_at),
      }
    }
  })

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage,
      hasPrevPage: res.hasPrevPage,
      startCursor: res.startCursor,
      endCursor: res.endCursor
    }
  }
}