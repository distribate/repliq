import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumCategoriesClient } from "@repo/shared/api/forum-client";

export const categoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getMainCategoriesWithThreads())
}, "categoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())

async function getMainCategoriesWithThreads() {
  const res = await forumCategoriesClient.categories["get-latest-category-threads"].$get();
  const data = await res.json();

  if (!data || "error" in data) return null

  return data.data;
}