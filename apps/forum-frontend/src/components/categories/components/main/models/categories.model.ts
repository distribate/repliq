import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumCategoriesClient } from "#shared/forum-client";

async function getMainCategoriesWithThreads() {
  const res = await forumCategoriesClient.categories["get-latest-category-threads"].$get();
  const data = await res.json();

  if (!data || "error" in data) return null

  return data.data;
}

export const mainCategoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getMainCategoriesWithThreads())
}, "mainCategoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())