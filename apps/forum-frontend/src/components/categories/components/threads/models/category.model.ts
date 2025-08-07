import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { atom } from "@reatom/core"
import { forumCategoriesClient } from "#shared/forum-client"

async function getCategory(id: string) {
  const res = await forumCategoriesClient.categories["get-category"][":id"].$get({ param: { id } })
  const data = await res.json()
  if (!data || 'error' in data) return null
  return data
}

export const categoryIdAtom = atom<string | null>(null, "categoryIdAtom")

export const categoryResource = reatomResource(async (ctx) => {
  const target = ctx.spy(categoryIdAtom)
  if (!target) return
  return await ctx.schedule(() => getCategory(target))
}).pipe(withDataAtom(), withStatusesAtom(), withCache())
