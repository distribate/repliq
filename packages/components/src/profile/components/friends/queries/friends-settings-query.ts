import { getUserFriendsSchema } from '@repo/types/schemas/user/get-user-friends-schema';
import { QueryKey, useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";
import { z } from "zod";

export const FRIENDS_SORT_QUERY_KEY: QueryKey = createQueryKey("ui", [
  "friends-filter-settings",
]);

export type FriendsSortType = "created_at" | "donate_weight";

export type FriendsSortQuery = Omit<z.infer<typeof getUserFriendsSchema>, "with_details"> & {
  searchQuery: string;
  type: "first" | "other"
}

const initial: FriendsSortQuery = {
  sort_type: "created_at",
  searchQuery: "",
  type: "first",
  ascending: false
};

export const friendsSortQuery = () => useQuery<FriendsSortQuery>({
  queryKey: FRIENDS_SORT_QUERY_KEY,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  initialData: initial,
});