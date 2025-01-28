import { forumThreadClient } from "@repo/shared/api/forum-client";

export const getThreadImages = async (id: string) => {
  const res = await forumThreadClient.thread["get-thread-images"][":id"].$get({
    param: { id },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}