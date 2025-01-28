import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";

async function getFriendsCount(nickname: string) {
  const res = await forumUserClient.user["get-user-friends-count"][":nickname"].$get({
    param: {
      nickname
    }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return null;
  }

  return data.data
}

export const FRIENDS_COUNT_QUERY_KEY = (nickname: string) => createQueryKey("user", ["friends", "count", nickname])

export const friendsCountQuery = (nickname: string) => useQuery({
  queryKey: FRIENDS_COUNT_QUERY_KEY(nickname),
  queryFn: () => getFriendsCount(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})