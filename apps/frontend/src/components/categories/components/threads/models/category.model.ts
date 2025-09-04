import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { categoriesClient } from "#shared/forum-client"

export const categoryIdAtom = atom<string | null>(null, "categoryIdAtom")

export const categoryResource = reatomResource(async (ctx) => {
  const id = ctx.spy(categoryIdAtom)
  if (!id) return

  return await ctx.schedule(async () => {
    const res = await categoriesClient.categories["get-category"][":id"].$get(
      { param: { id } }, { init: { signal: ctx.controller.signal } }
    )
    
    const data = await res.json()

    if ('error' in data) throw new Error(data.error)

    return data
  })
}, "categoryResource").pipe(withDataAtom(), withStatusesAtom(), withCache())
