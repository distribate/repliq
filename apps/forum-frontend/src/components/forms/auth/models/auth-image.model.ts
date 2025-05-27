import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumSharedClient } from "@repo/shared/api/forum-client"

async function getStaticImage() {
  const res = await forumSharedClient.shared["get-auth-image"].$get({ query: { random: "true" } })
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const authImageResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getStaticImage())
}, "authImageResource").pipe(withDataAtom(), withStatusesAtom(), withCache())