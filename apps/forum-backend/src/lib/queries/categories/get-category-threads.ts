import type { getCategoryThreadsSchema } from "#routes/categories/get-category-threads.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import type { z } from "zod";

type ThreadsFromCategories = z.infer<typeof getCategoryThreadsSchema> & {
  id: string
}

export async function getThreadsCategories({
  id, ascending, limit, cursor
}: ThreadsFromCategories) {
  let query = forumDB
    .selectFrom("threads")
    .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
    .innerJoin("users", "threads_users.user_nickname", "users.nickname")
    .select([
      "threads.id", 
      "threads.title", 
      "threads.created_at", 
      "threads.updated_at", 
      "threads.visibility",
      "users.nickname",
      "users.name_color",
    ])
    .where("threads.category_id", "=", id)
    .orderBy("threads.created_at", ascending ? "asc" : "desc")

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