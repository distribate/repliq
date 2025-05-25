import { forumThreadClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { getLatestRegUsers } from "#components/layout/components/stats/last-res-users.model";

async function getLastThreads(limit: number) {
  const res = await forumThreadClient.thread["get-latest-threads"].$get({
    query: { limit: `${limit}`  }
  })

  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

const DEFAULT_RELATED_LENGTH = 5

export async function getSearchRelated() {
  const [lastUsers, lastThreads] = await Promise.all([
    getLatestRegUsers(DEFAULT_RELATED_LENGTH), getLastThreads(DEFAULT_RELATED_LENGTH)
  ]);

  return { lastUsers, lastThreads };
}

export const relatedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getSearchRelated())
}, "relatedAction").pipe(withStatusesAtom(), withDataAtom(), withCache())