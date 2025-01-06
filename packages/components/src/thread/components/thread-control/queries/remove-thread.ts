import { forumThreadClient } from "@repo/shared/api/forum-client";

export async function removeThread(threadId: string) {
  const res = await forumThreadClient.thread["remove-thread"][":threadId"].$delete({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data;
}