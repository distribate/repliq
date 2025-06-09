import { forumSharedClient } from "@repo/shared/api/forum-client";
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";

async function getFavoriteItems() {
  const res = await forumSharedClient.shared["get-minecraft-items"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const favoriteItemsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getFavoriteItems())
}, "favoriteItemsResource").pipe(withDataAtom(), withStatusesAtom(), withCache())