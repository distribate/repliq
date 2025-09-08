import { validateResponse } from "#shared/api/validation"
import { adminClient } from "#shared/forum-client"
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"

export const adminsListAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await adminClient.private["admins"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res)
  })
}, {
  name: "adminsListAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withDataAtom(), withStatusesAtom())
