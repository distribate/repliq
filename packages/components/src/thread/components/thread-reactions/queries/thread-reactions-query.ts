import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { getThreadReactions } from "./get-thread-reactions";

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