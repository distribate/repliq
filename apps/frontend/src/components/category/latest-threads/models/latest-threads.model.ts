import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { categoriesClient } from "#shared/api/forum-client";
import { validateResponse } from "#shared/api/validation";

export const latestThreadsByCategoriesAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await categoriesClient.category["latest-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );
    return validateResponse<typeof res>(res)
  })
}, {
  name: "latestThreadsByCategoriesAction",
  onReject: (ctx, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))