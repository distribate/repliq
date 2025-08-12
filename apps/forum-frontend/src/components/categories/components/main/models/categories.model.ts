import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumCategoriesClient } from "#shared/forum-client";

export const mainCategoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumCategoriesClient.categories["get-latest-category-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, "mainCategoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())