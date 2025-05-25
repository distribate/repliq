import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumUserClient } from "@repo/shared/api/forum-client"

async function getPurchases() {
  const res = await forumUserClient.user["get-user-purchases"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const myPurchasesResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getPurchases())
}, "myPurchasesResource").pipe(withDataAtom(), withStatusesAtom(), withCache())