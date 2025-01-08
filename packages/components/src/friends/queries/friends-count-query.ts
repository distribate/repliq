import { useQuery } from "@tanstack/react-query";
import { getFriendsCount } from "./get-friends-count";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

export const FRIENDS_COUNT_QUERY_KEY = (nickname: string) => createQueryKey("user", ["friends", "count", nickname])

export const friendsCountQuery = (nickname: string) => useQuery({
  queryKey: FRIENDS_COUNT_QUERY_KEY(nickname),
  queryFn: () => getFriendsCount(nickname),
})