import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumThreadClient } from "@repo/shared/api/forum-client";

async function getThreadReactions(threadId: string) {
  const res = await forumThreadClient.thread["get-thread-user-reactions"][":threadId"].$get({
    param: { threadId },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data;
}

export const THREAD_REACTIONS_QUERY_KEY = (thread_id: string) =>
  createQueryKey("ui", ["thread-rating"], thread_id);

export const threadReactionsQuery = (thread_id: string) => useQuery({
  queryKey: THREAD_REACTIONS_QUERY_KEY(thread_id),
  queryFn: () => getThreadReactions(thread_id),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: 86000,
  placeholderData: keepPreviousData
});