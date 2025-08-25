import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumSharedClient } from "#shared/forum-client";

export const publicStatsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumSharedClient.shared["get-public-stats"].$get()
    const data = await res.json()

    if ("error" in data) {
      return null;
    }

    return {
      threads: Number(data.data.threads_count),
      users: Number(data.data.users_count),
      posts: Number(data.data.posts_count)
    }
  })
}).pipe(withStatusesAtom(), withCache(), withDataAtom({ users: 0, threads: 0, posts: 0 }))