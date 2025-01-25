import type { ThreadPreview } from "@repo/types/entities/thread-type";
import { getThreadShorted } from "./get-thread-shorted";

export async function getThreadPreview(threadId: string): Promise<ThreadPreview | null> {
  const thread = await getThreadShorted(threadId)

  if (!thread) return null;

  return {
    ...thread,
    owner: {
      nickname: thread.user_nickname,
      name_color: thread.name_color
    }
  }
}