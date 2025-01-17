import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumThreadClient } from "@repo/shared/api/forum-client";

const THREAD_IMAGES_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-images"], thread_id);

const getThreadImages = async (id: string) => {
  const res = await forumThreadClient.thread["get-thread-images"][":id"].$get({
    param: { id },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const threadImagesQuery = (thread_id: string) => useQuery({
  queryKey: THREAD_IMAGES_QUERY_KEY(thread_id),
  queryFn: () => getThreadImages(thread_id),
  refetchOnWindowFocus: false,
});