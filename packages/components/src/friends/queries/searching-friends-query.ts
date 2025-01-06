import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSearchingFriends } from "./get-searching-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const SEARCHING_FRIENDS_QUERY_KEY =
  createQueryKey("user", ["friends", "searching"]);

export const searchingFriends = () => useQuery({
  queryKey: SEARCHING_FRIENDS_QUERY_KEY,
  queryFn: () => getSearchingFriends(),
  refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
});