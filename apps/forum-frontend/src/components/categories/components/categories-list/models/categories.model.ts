import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { sleep } from "@reatom/framework";
import { forumCategoriesClient } from "@repo/shared/api/forum-client";

async function getMainCategoriesWithThreads() {
  const res = await forumCategoriesClient.categories["get-latest-category-threads"].$get();
  const data = await res.json();

  if (!data || "error" in data) return null

  return data.data;
}

export const categoriesResource = reatomResource(async (ctx) => {
  await sleep(2000)
  return await ctx.schedule(() => getMainCategoriesWithThreads())
}, "categoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())