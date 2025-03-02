import { getThreadModel } from "#components/thread/queries/get-thread-model.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const THREAD_QUERY_KEY = (threadId: string) => createQueryKey('ui', ["thread", threadId])

export const threadQuery = (threadId: string) => useQuery({
  queryKey: THREAD_QUERY_KEY(threadId),
  queryFn: () => getThreadModel(threadId),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
})