import type { getUserThreadsSchema } from '#routes/user/get-user-threads.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { sql, type Expression, type SqlBool } from 'kysely';
import { executeWithCursorPagination } from 'kysely-paginate';
import * as z from "zod";

type GetUserThreads = z.infer<typeof getUserThreadsSchema>

export async function getUserThreadsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .select(forumDB.fn.countAll().as('count'))
    .$castTo<{ count: number }>()
    .where("nickname", "=", nickname)
    .executeTakeFirst()

  if (!query) {
    return 0
  }

  return query.count
}

export const getUserThreads = async (
  nickname: string,
  { searchQuery, cursor }: GetUserThreads
) => {
  let query = forumDB
    .selectFrom("threads_users")
    .innerJoin("threads", "threads.id", "threads_users.thread_id")
    .selectAll("threads")
    .select([
      sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('comments_count')
    ])
    .where("threads_users.nickname", "=", nickname)
    .groupBy("threads.id")

  if (searchQuery && searchQuery.length >= 1) {
    query = query.where("threads.title", "ilike", `%${searchQuery}%`)
  }

  const res = await executeWithCursorPagination(query, {
    perPage: 16,
    fields: [
      {
        key: "created_at",
        direction: "desc",
        expression: "threads.created_at",
      }
    ],
    parseCursor: (cursor) => ({
      created_at: new Date(cursor.created_at)
    }),
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