import type { ThreadPreview } from "@repo/types/entities/thread-type";
import { getThreadShorted } from "./get-thread-shorted";

export async function getThreadPreview(threadId: string): Promise<ThreadPreview | null> {
  const thread = await getThreadShorted(threadId)

  if (!thread) return null;

  return {
    ...thread,
    properties: {
      is_comments: thread.is_comments
    },
    comments_count: thread.thread_comments_count,
    views_count: thread.thread_views_count,
    owner: {
      nickname: thread.user_nickname,
      name_color: thread.name_color,
      avatar: thread.avatar
    }
  }
}