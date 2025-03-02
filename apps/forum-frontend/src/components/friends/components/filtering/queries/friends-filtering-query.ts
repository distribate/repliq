import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export type FriendsFilteringViewType = "grid" | "list";
export type FriendsFilteringSortType = "date" | "abc";
export type FriendsFilteringListType = "all"| "incoming"| "outgoing"| "search";

export type FriendsFilteringQuery = {
  listType: FriendsFilteringListType;
  viewType: FriendsFilteringViewType;
  sortType: FriendsFilteringSortType;
  searchQuery: string;
};

export const FRIENDS_FILTERING_QUERY_KEY = createQueryKey("ui", ["friends", "filtering"]);

const initial: FriendsFilteringQuery = {
  listType: "all",
  viewType: "list",
  sortType: "date",
  searchQuery: "",
};

export const friendsFilteringQuery = () => useQuery<FriendsFilteringQuery, Error>({
  queryKey: FRIENDS_FILTERING_QUERY_KEY,
  initialData: initial,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});