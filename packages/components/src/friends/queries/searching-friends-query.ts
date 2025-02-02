import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { forumUserClient } from "@repo/shared/api/forum-client";

async function getSearchingFriends() {
  const res = await forumUserClient.user["get-recommended-friends"].$get({
    query: { type: "searching" },
  });

  const data = await res.json();

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const SEARCHING_FRIENDS_QUERY_KEY =
  createQueryKey("user", ["friends", "searching"]);

export const searchingFriends = () => useQuery({
  queryKey: SEARCHING_FRIENDS_QUERY_KEY,
  queryFn: () => getSearchingFriends(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData,
});