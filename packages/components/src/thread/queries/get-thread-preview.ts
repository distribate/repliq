import { forumThreadClient } from "@repo/shared/api/forum-client";

export const getThreadPreview = async (threadId: string) => {
  const res = await forumThreadClient.thread['get-thread-preview'][':threadId'].$get({
    param: {
      threadId: threadId,
    },
  });

  const data = await res.json();

  if (!data || 'error' in data) {
    console.error(data?.error);
    return null;
  }

  return data.data;
}