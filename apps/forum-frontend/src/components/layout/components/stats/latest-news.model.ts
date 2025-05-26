import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { forumSharedClient } from "@repo/shared/api/forum-client"

const getLatestNews = async () => {
  const res = await forumSharedClient.shared["get-news"].$get({
    query: { limit: "2", ascending: "true" }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const latestNewsResource =reatomResource(async (ctx) => {
  return await ctx.schedule(() => getLatestNews())
}, "latestNewsResource").pipe(withDataAtom(), withCache(), withStatusesAtom())
