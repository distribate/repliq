import { forumThreadClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { getLatestRegUsers } from "#components/layout/components/stats/latest-reg-users.model";
import { sleep } from "@reatom/framework";
import { searchPageTypeAtom } from "./search-page.model";

async function getLastThreads(limit: number) {
  const res = await forumThreadClient.thread["get-latest-threads"].$get({ query: { limit: `${limit}` } })
  const data = await res.json()
  if ("error" in data) return null
  return data.data
}

const DEFAULT_RELATED_LENGTH = 5

export const defineSearchSectionAction = reatomAsync(async (ctx) => {
  const type = ctx.get(searchPageTypeAtom)

  switch (type) {
    case "all":
      usersRelatedAction(ctx)
      threadRelatedAction(ctx)
      return;
    case "users":
      return usersRelatedAction(ctx)
    case "threads":
      return threadRelatedAction(ctx)
  }
}, "defineSearchSectionAction")

export const threadRelatedAction = reatomAsync(async (ctx) => {
  await sleep(200)
  return await ctx.schedule(() => getLastThreads(DEFAULT_RELATED_LENGTH))
}, "threadRelatedAction").pipe(withStatusesAtom(), withDataAtom(), withCache())

export const usersRelatedAction = reatomAsync(async (ctx) => {
  await sleep(200)
  return await ctx.schedule(() => getLatestRegUsers(DEFAULT_RELATED_LENGTH))
}, "usersRelatedAction").pipe(withStatusesAtom(), withDataAtom(), withCache())