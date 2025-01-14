import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export async function getThreadMain(threadId: string) {
  const result = await forumDB
    .selectFrom('threads')
    .leftJoin('threads_images', 'threads.id', 'threads_images.thread_id')
    .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
    .select([
      'threads.id',
      'threads.description',
      "threads.title",
      "threads.content",
      'threads.is_comments',
      'threads.is_updated',
      "threads.category_id",
      sql<string>`threads.updated_at::text`.as('updated_at'),
      sql<string>`threads.created_at::text`.as('created_at'),
      sql<string[]>`ARRAY(SELECT tags FROM threads_tags WHERE thread_id = threads.id)`.as('threads_tags'),
      sql<boolean>`
        CASE
          WHEN COUNT(threads_images.id) > 0 THEN true
          ELSE false
        END
      `.as('is_images'),
      sql<number>`COUNT(threads_views.id)`.as('threads_views_count'),
      sql<number>`(SELECT COUNT(*) FROM comments WHERE parent_type = 'thread' AND CAST(parent_id AS uuid) = threads.id)`.as('threads_comments_count'),
    ])
    .where('threads.id', '=', threadId)
    .groupBy('threads.id')
    .executeTakeFirst();

  if (!result) return null;

  return result
}