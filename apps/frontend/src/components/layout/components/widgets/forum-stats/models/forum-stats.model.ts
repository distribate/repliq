import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { sharedClient } from "#shared/forum-client";

export async function getStats(init?: RequestInit) {
  const res = await sharedClient.shared["get-public-stats"].$get({}, { init })
  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return {
    threads: Number(data.data.threads_count),
    users: Number(data.data.users_count),
    posts: Number(data.data.posts_count)
  }
}

export const publicStatsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getStats({ signal: ctx.controller.signal }))
}).pipe(withStatusesAtom(), withCache(), withDataAtom({ users: 0, threads: 0, posts: 0 }))