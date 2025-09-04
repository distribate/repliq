import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { categoriesClient } from "#shared/forum-client";

export const mainCategoriesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await categoriesClient.categories["get-latest-category-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );

    const data = await res.json();

    if ("error" in data) throw new Error(data.error)

    return data.data;
  })
}, "mainCategoriesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())