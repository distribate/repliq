import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { userClient } from "#shared/forum-client";
import { validateResponse } from "#shared/api/validation";

export const myThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["my-threads"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    );
    
    return validateResponse<typeof res>(res);
  })
}, {
  name: "myThreadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())