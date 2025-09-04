import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { commentClient } from "#shared/forum-client"

export const latestCommentsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await commentClient.comment["get-last-comments"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )
    
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data
  })
}, "latestCommentsResource").pipe(withDataAtom(), withStatusesAtom(), withCache())