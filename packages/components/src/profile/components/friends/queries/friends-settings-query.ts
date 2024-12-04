import { QueryKey, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const FRIENDS_SORT_QUERY_KEY: QueryKey = createQueryKey("ui", [
  "friends-filter-settings",
]);

export type FriendsSortType = "created_at" | "donate";

export type FriendsSortQuery = {
  type: FriendsSortType;
  querySearch: string | null;
};

const initial: FriendsSortQuery = {
  type: "created_at",
  querySearch: null,
};

export const friendsSortQuery = () =>
  useQuery<FriendsSortQuery>({
    queryKey: FRIENDS_SORT_QUERY_KEY,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: initial,
  });
