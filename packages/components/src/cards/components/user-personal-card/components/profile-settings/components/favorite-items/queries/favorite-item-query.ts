
import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { forumUserClient } from "@repo/shared/api/forum-client";

export const FAVORITE_ITEM_QUERY_KEY = (nickname: string) => 
  createQueryKey("ui", ["favorite-item", `${nickname}`]);

async function getFavoriteItem(nickname: string) {
  const res = await forumUserClient.user["get-user-favorite-item"][":nickname"].$get({
    param: { nickname }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const favoriteItemQuery = (nickname: string, enabled: boolean = true) => useQuery({
  queryKey: FAVORITE_ITEM_QUERY_KEY(nickname),
  queryFn: () => getFavoriteItem(nickname),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled
});