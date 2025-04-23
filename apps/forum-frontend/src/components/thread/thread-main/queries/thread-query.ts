import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

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

export const THREAD_QUERY_KEY = (threadId: string) => createQueryKey('ui', ["thread", threadId])

export const threadQuery = (threadId: string) => useQuery({
  queryKey: THREAD_QUERY_KEY(threadId),
  queryFn: () => getThreadModel(threadId),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
})