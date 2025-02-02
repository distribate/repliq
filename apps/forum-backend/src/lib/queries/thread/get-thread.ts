import type { ThreadDetailed } from "@repo/types/entities/thread-type";
import { getThreadMain } from "./get-thread-main";

type GetThread = {
  threadId: string;
  nickname: string
}

export async function getThread({
  threadId
}: Omit<GetThread, "nickname">): Promise<ThreadDetailed | null> {
  const thread = await getThreadMain(threadId)

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
    images_count: Number(thread.images_count),
    views_count: Number(thread.views_count),
    properties: {
      is_updated: thread.is_updated,
      is_comments: thread.is_comments
    },
    owner: {
      nickname: thread.nickname!,
      name_color: thread.name_color
    }
  };
}