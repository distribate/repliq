import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getFriends } from "./get-friends.ts";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder.ts";

export const FRIENDS_QUERY_KEY = (nickname: string) =>
  createQueryKey("user", ["friends"], nickname);

export type FriendsQuery = {
  nickname: string
  with_details?: boolean
  sort_type: "created_at" | "donate_weight"
  ascending: boolean
};

export const friendsQuery = ({
  nickname, with_details = true, sort_type, ascending
}: FriendsQuery) => useQuery({
  queryKey: FRIENDS_QUERY_KEY(nickname),
  queryFn: () => getFriends({ nickname, with_details, sort_type, ascending }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData
})