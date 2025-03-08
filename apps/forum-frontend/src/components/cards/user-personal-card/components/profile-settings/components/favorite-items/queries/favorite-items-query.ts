import { useQuery } from "@tanstack/react-query";
import { MinecraftItemEntity } from "@repo/types/entities/entities-type.ts";
import { forumSharedClient } from "@repo/shared/api/forum-client";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";

async function getFavoriteItems() {
  const res = await forumSharedClient.shared["get-minecraft-items"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const FAVORITE_ITEMS_QUERY_KEY = createQueryKey("ui", ["minecraft-items"])

export const favoriteItemsQuery = () => useQuery<MinecraftItemEntity[] | null, Error>({
  queryKey: FAVORITE_ITEMS_QUERY_KEY,
  queryFn: () => getFavoriteItems(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
});