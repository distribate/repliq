import type { getCategoryThreadsSchema } from "#routes/categories/get-category-threads.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import { sql, type OrderByDirectionExpression } from "kysely";
import * as z from "zod";

type ThreadsFromCategories = z.infer<typeof getCategoryThreadsSchema>

export async function getThreadsCategories(
  id: string,
  { ascending, limit, cursor, searchQuery, type }: ThreadsFromCategories
) {
  const direction: OrderByDirectionExpression = ascending ? "asc" : "desc";

  let query = forumDB
    .selectFrom("threads")
    .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
    .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
    .innerJoin("users", "threads_users.nickname", "users.nickname")
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
      sql<number>`COALESCE(COUNT(threads_views.id), 0)`.as("views_count"),
      sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('comments_count'),
    ])
    .where("threads.category_id", "=", id)
    .groupBy([
      "threads.id",
      "threads.title",
      "threads.description",
      "threads.created_at",
      "threads.is_comments",
      "users.nickname",
      "users.name_color",
      "users.avatar",
    ])

  if (searchQuery) {
    const safeQuery = searchQuery.trim();

    query = query
      .where(sql<boolean>`threads.title ILIKE '%' || ${safeQuery} || '%'`)
      .orderBy(sql`similarity(threads.title, ${safeQuery}) DESC`)
  }

  if (type === 'created_at') {
    const res = await executeWithCursorPagination(query, {
      after: cursor,
      perPage: limit ?? 12,
      fields: [
        {
          key: "created_at",
          expression: "threads.created_at",
          direction
        }
      ],
      parseCursor: (cursor) => {
        return { created_at: new Date(cursor.created_at) };
      }
    })

    return {
      data: res.rows,
      meta: {
        hasNextPage: res.hasNextPage ?? false,
        hasPrevPage: res.hasPrevPage ?? false,
        startCursor: res.startCursor,
        endCursor: res.endCursor
      }
    }
  }

  if (type === 'views_count') {
    const res = await executeWithCursorPagination(query, {
      after: cursor,
      perPage: limit ?? 12,
      fields: [
        {
          key: "views_count",
          expression: sql<number>`COALESCE(COUNT(threads_views.id), 0)`,
          direction
        }
      ],
      parseCursor: (cursor) => {
        return { views_count: Number(cursor.views_count) };
      }
    })

    return {
      data: res.rows,
      meta: {
        hasNextPage: res.hasNextPage ?? false,
        hasPrevPage: res.hasPrevPage ?? false,
        startCursor: res.startCursor,
        endCursor: res.endCursor
      }
    }
  }

  throw new Error("Type is not defined", type)
}