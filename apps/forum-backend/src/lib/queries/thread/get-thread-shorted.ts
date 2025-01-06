import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export async function getThreadShorted(threadId: string) {
  return await forumDB
    .selectFrom("threads")
    .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
    .select([
      'threads.id',
      "threads.title",
      'threads.description',
      'threads.is_comments',
      sql<string>`threads.created_at::text`.as('created_at'),
      sql<number>`COUNT(threads_views.id)`.as('thread_views_count'),
      sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('thread_comments_count'),
    ])
    .where('threads.id', '=', threadId)
    .groupBy('threads.id')
    .executeTakeFirst()
}