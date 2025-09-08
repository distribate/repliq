import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { commentClient } from "#shared/forum-client"
import { validateResponse } from "#shared/api/validation"

export const latestCommentsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await commentClient.comment["latest-comments"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )
    
    return validateResponse<typeof res>(res)
  })
}, "latestCommentsResource").pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))