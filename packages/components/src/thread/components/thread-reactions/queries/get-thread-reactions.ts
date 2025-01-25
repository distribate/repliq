import { forumThreadClient } from "@repo/shared/api/forum-client";

export async function getThreadReactions(threadId: string) {
  const res = await forumThreadClient.thread["get-thread-user-reactions"][":threadId"].$get({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}