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
    ...thread,
    category_id: Number(thread.category_id),
    threads_comments_count: Number(thread.threads_comments_count),
    owner: {
      nickname: thread.nickname!,
      name_color: thread.name_color
    }
  };
}