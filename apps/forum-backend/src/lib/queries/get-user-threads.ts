import { forumDB } from '@repo/shared/db/forum-db.ts';
import type { Expression, SqlBool } from 'kysely';
import { getUserThreadsSchema } from '#routes/get-user-threads.ts';
import { z } from 'zod';

type GetUserThreads = {
  nickname: string
} & Pick<z.infer<typeof getUserThreadsSchema>, "querySearch">

export const getUserThreads = async ({
  nickname, querySearch
}: GetUserThreads) => {
  const threadsWithCounts = await forumDB
  .selectFrom("threads_users")
  .innerJoin("threads", "threads.id", "threads_users.thread_id")
  .leftJoin("threads_comments", "threads.id", "threads_comments.thread_id")
  .selectAll("threads")
  .select([
    forumDB.fn.count("threads_comments.id").as("commentsCount"),
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
    commentsCount: Number(thread.commentsCount),
  }));
}