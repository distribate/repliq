import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumThreadClient } from "@repo/shared/api/forum-client";
import { getLatestRegUsers } from "@repo/lib/queries/last-reg-users-query";

async function getLastThreads(limit: number) {
  const res = await forumThreadClient.thread["get-latest-threads"].$get({
    query: {
      limit: `${limit}`
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

const DEFAULT_RELATED_LENGTH = 5

export async function getSearchRelated() {
  const [lastUsers, lastThreads] = await Promise.all([
    getLatestRegUsers(DEFAULT_RELATED_LENGTH), getLastThreads(DEFAULT_RELATED_LENGTH)
  ]);

  return { lastUsers, lastThreads };
}

export const RELATED_QUERY_KEY = createQueryKey("ui", ["related"]);

export const relatedQuery = () => useQuery({
  queryKey: RELATED_QUERY_KEY,
  queryFn: getSearchRelated,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
  retry: 1
});