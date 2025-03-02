import { forumThreadClient } from "@repo/shared/api/forum-client.ts";

export async function getThreadModel(threadId: string) {
  const res = await forumThreadClient.thread['get-thread'][':threadId'].$get({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    return null;
  }

  return data.data;
}