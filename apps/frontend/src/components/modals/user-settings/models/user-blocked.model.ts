import { validateResponse } from '#shared/api/validation';
import { userClient } from '#shared/api/forum-client';
import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';

export const userBlockedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["blocked-users"].$get(
      { query: { cursor: undefined } },
      { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res)
  })
}, {
  name: "userBlockedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())