import { validateResponse } from "#shared/api/validation";
import { userClient } from "#shared/api/forum-client";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";

export const savedThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["saved-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res);
  })
}, {
  name: "savedThreadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())