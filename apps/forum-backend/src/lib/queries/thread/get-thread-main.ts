import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

export async function getThreadMain(threadId: string) {
  const result = await forumDB
    .selectFrom('threads')
    .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
    .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
    .leftJoin("users", "threads_users.user_nickname", "users.nickname")
    .leftJoin(
      forumDB
        .selectFrom('threads_tags')
        .select([
          'thread_id',
          sql<string[]>`ARRAY_AGG(tags)`.as('tags_array')
        ])
        .groupBy('thread_id')
        .as('thread_tags'),
      'thread_tags.thread_id',
      'threads.id'
    )
    .leftJoin(
      forumDB
        .selectFrom("threads_images")
        .select([
          "thread_id",
          sql<number>`COUNT(*)`.as("images_count")
        ])
        .groupBy('thread_id')
        .as('images_count'),
      'images_count.thread_id',
      'threads.id'
    )
    .leftJoin(
      forumDB
        .selectFrom('comments')
        .select([
          'parent_id',
          sql<number>`COUNT(*)`.as('comments_count')
        ])
        .where('parent_type', '=', 'thread')
        .groupBy('parent_id')
        .as('comments_count'),
      'comments_count.parent_id',
      'threads.id'
    )
    .select(eb => [
      'threads.id',
      'threads.description',
      "threads.title",
      "threads.content",
      'threads.is_comments',
      'threads.is_updated',
      "threads.category_id",
      "users.nickname",
      "users.name_color",
      eb.cast<string>('threads.updated_at', 'text').as('updated_at'),
      eb.cast<string>('threads.created_at', 'text').as('created_at'),
      sql<string[]>`COALESCE(thread_tags.tags_array, '{}')`.as('tags'),
      sql<number>`COUNT(threads_views.id)`.as('views_count'),
      sql<number>`COALESCE(comments_count.comments_count, 0)`.as('comments_count'),
      sql<number>`COALESCE(images_count.images_count, 0)`.as('images_count'),
    ])
    .where('threads.id', '=', threadId)
    .groupBy([
      'threads.id',
      'threads.description',
      "threads.title",
      "threads.content",
      'threads.is_comments',
      'threads.is_updated',
      "threads.category_id",
      "users.nickname",
      "users.name_color",
      'threads.updated_at',
      'threads.created_at',
      'thread_tags.tags_array',
      'comments_count.comments_count',
      'images_count.images_count',
    ])
    .executeTakeFirst();

  if (!result) return null;

  return result
}