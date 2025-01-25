import type { getUserThreadsSchema } from '#routes/user/get-user-threads.ts';
import { forumDB } from '#shared/database/forum-db.ts';
import { sql, type Expression, type SqlBool } from 'kysely';
import { z } from 'zod';

type GetUserThreads = {
  nickname: string
} & Pick<z.infer<typeof getUserThreadsSchema>, "querySearch">

export async function getUserThreadsCount(nickname: string) {
  const query = await forumDB
    .selectFrom("threads_users")
    .select(forumDB.fn.countAll().as('count'))
    .$castTo<{ count: number }>()
    .where("user_nickname", "=", nickname)
    .executeTakeFirst()

  if (!query) {
    return 0
  }

  return query.count
}

export const getUserThreads = async ({
  nickname, querySearch
}: GetUserThreads) => {
  const threadsWithCounts = await forumDB
  .selectFrom("threads_users")
  .innerJoin("threads", "threads.id", "threads_users.thread_id")
  .selectAll("threads")
  .select([
    sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('comments_count')
  ])
  .where((eb) => {
    const filters: Expression<SqlBool>[] = [];
    
    filters.push(eb("threads_users.user_nickname", "=", nickname))
    
    if (querySearch) {
      filters.push(eb("threads.title", "ilike", `%${querySearch}%`))
    }
    
    return eb.and(filters)
  })
  .groupBy("threads.id")
  .execute();
  
  return threadsWithCounts.map((thread) => ({
    ...thread,
    comments_count: Number(thread.comments_count),
  }));
}