import { forumThreadClient } from "@repo/shared/api/forum-client";

export const getThreadPreview = async (threadId: string) => {
  const res = await forumThreadClient.thread['get-thread-preview'][':threadId'].$get({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    return null;
  }

  return data.data;
}