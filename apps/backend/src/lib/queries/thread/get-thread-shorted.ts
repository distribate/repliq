import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

const query = forumDB
  .selectFrom("threads")
  .leftJoin("threads_views", "threads.id", "threads_views.thread_id")
  .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
  .leftJoin("users", "threads_users.nickname", "users.nickname")
  .leftJoin(
    forumDB
      .selectFrom("comments")
      .select([
        "parent_id",
        sql<number>`COUNT(*)`.as("comment_count")
      ])
      .where("parent_type", "=", "thread")
      .groupBy("parent_id")
      .as("comments_count"),
    "comments_count.parent_id",
    "threads.id"
  )
  .select([
    'threads.id',
    "threads.title",
    'threads.description',
    'threads.is_comments',
    "threads_users.nickname",
    "users.name_color",
    "users.avatar",
    sql<string>`threads.created_at::text`.as('created_at'),
    sql<number>`COUNT(threads_views.id)`.as('thread_views_count'),
    sql<number>`COALESCE(comments_count.comment_count, 0)`.as("thread_comments_count")
  ])
  .groupBy([
    "threads.id",
    "threads.title",
    "threads.description",
    "threads.is_comments",
    "threads_users.nickname",
    "users.name_color",
    "users.avatar",
    "threads.created_at"
  ])

export async function getThreadShorted(threadId: string) {
  return query
    .where('threads.id', '=', threadId)
    .executeTakeFirst()
}