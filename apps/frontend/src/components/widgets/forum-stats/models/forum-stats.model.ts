import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { sharedClient } from "#shared/api/forum-client";
import { validateResponse } from "#shared/api/validation";

export async function getStats(init?: RequestInit) {
  const res = await sharedClient.shared["public-stats"].$get({}, { init })
  const data = await validateResponse<typeof res>(res);

  return {
    threads: Number(data.threads_count),
    users: Number(data.users_count),
    posts: Number(data.posts_count)
  }
}

export const publicStatsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getStats({ signal: ctx.controller.signal }))
}).pipe(withStatusesAtom(), withCache(), withDataAtom({ users: 0, threads: 0, posts: 0 }))