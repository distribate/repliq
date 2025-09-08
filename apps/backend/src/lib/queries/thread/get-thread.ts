import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getPublicUrl } from "#utils/get-public-url.ts";
import { forumDB } from "#shared/database/forum-db.ts";
import { sql } from "kysely";

const query = forumDB
  .selectFrom('threads')
  .leftJoin('threads_views', 'threads.id', 'threads_views.thread_id')
  .innerJoin("threads_users", "threads.id", "threads_users.thread_id")
  .leftJoin("users", "threads_users.nickname", "users.nickname")
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
        sql<string[]>`array_agg(DISTINCT image_url)`.as("images")
      ])
      .groupBy("thread_id")
      .as("images_agg"),
    "images_agg.thread_id",
    "threads.id"
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
    "users.avatar",
    eb.cast<string>('threads.updated_at', 'text').as('updated_at'),
    eb.cast<string>('threads.created_at', 'text').as('created_at'),
    sql<string[]>`COALESCE(thread_tags.tags_array, '{}')`.as('tags'),
    sql<number>`COUNT(threads_views.id)`.as('views_count'),
    sql<string[]>`COALESCE(images_agg.images, '{}')`.as("images"),
    sql<number>`COALESCE(comments_count.comments_count, 0)`.as('comments_count'),
  ])
  .groupBy([
    'threads.id',
    'threads.description',
    "threads.title",
    "threads.content",
    'threads.is_comments',
    'threads.is_updated',
    "threads.category_id",
    'threads.updated_at',
    'threads.created_at',
    "users.nickname",
    "users.avatar",
    "users.name_color",
    'thread_tags.tags_array',
    'comments_count.comments_count',
    "images_agg.images"
  ])

async function getThreadMain(threadId: string) {
  const result = await query
    .where('threads.id', '=', threadId)
    .executeTakeFirst();

  return result
}

async function getThreadByUser(id: string, nickname: string) {
  const query = await forumDB
    .selectFrom("threads_saved")
    .select('id')
    .where("nickname", "=", nickname)
    .where("thread_id", "=", id)
    .executeTakeFirst()

  return {
    is_saved: Boolean(query?.id)
  }
}

export async function getThread(
  id: string, 
  { nickname }: { nickname?: string }
): Promise<ThreadDetailed | null> {
  async function getOwner() {
    if (!nickname) return null

    return getThreadByUser(id, nickname)
  };

  const [thread, threadByUser] = await Promise.all([
    getThreadMain(id),
    getOwner()
  ])

  if (!thread) return null;

  return {
    id: thread.id,
    created_at: thread.created_at,
    updated_at: thread.updated_at,
    title: thread.title,
    description: thread.description,
    content: thread.content,
    tags: thread.tags,
    category_id: Number(thread.category_id),
    comments_count: Number(thread.comments_count),
    views_count: Number(thread.views_count),
    images: thread.images.map(image => getPublicUrl("threads", image)),
    properties: {
      is_updated: thread.is_updated,
      is_comments: thread.is_comments,
      is_saved: threadByUser?.is_saved
    },
    owner: {
      nickname: thread.nickname!,
      name_color: thread.name_color,
      avatar: thread.avatar
    }
  };
}