import { forumCategoriesClient } from "@repo/shared/api/forum-client.ts";
import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";

async function getAvailableCategories() {
  const res = await forumCategoriesClient.categories["get-available-categories"].$get()
  const data = await res.json()

  if (!data || 'error' in data) return null

  return data.data
}

export const availableCategoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getAvailableCategories())
}).pipe(withDataAtom(), withStatusesAtom(), withCache())