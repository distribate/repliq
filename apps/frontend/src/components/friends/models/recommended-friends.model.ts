import { validateResponse } from "#shared/api/validation";
import { friendClient } from "#shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";

export const recommendedFriendsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await friendClient.friend["recommended-friends"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );

    return validateResponse<typeof res>(res)
  })
}, {
  name: "recommendedFriendsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))