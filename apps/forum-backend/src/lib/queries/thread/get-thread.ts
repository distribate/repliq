import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getThreadMain } from "./get-thread-main";
import { forumDB } from "#shared/database/forum-db.ts";
import { getPublicUrl } from "#utils/get-public-url.ts";

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

export async function getThread({ id, nickname }: { id: string, nickname?: string }): Promise<ThreadDetailed | null> {
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