import { forumThreadClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { getLatestRegUsers } from "#components/layout/components/stats/latest-reg-users.model";
import { atom } from "@reatom/core";
import { Params } from "#components/shared/_protected/search";
import { sleep } from "@reatom/framework";

async function getLastThreads(limit: number) {
  const res = await forumThreadClient.thread["get-latest-threads"].$get({ query: { limit: `${limit}` } })
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

const DEFAULT_RELATED_LENGTH = 5
export const DEFAULT_TYPE_PARAM: Params["type"] = "users"

export const searchTypeParamAtom = atom<Params["type"]>(undefined, "searchTypeParam")
export const searchQueryParamAtom = atom<Params["query"]>(undefined, "searchQueryParam")

searchTypeParamAtom.onChange((ctx, state) => {
  if (state) {
    defineSearchSectionAction(ctx)
  }
})

export const defineSearchSectionAction = reatomAsync(async (ctx) => {
  const type = ctx.get(searchTypeParamAtom)
  if (!type) return;

  switch (type) {
    case "users":
      return usersRelatedAction(ctx)
    case "threads":
      return threadRelatedAction(ctx)
  }
}, "defineSearchSectionAction")

export const threadRelatedAction = reatomAsync(async (ctx) => {
  await sleep(2000)
  return await ctx.schedule(() => getLastThreads(DEFAULT_RELATED_LENGTH))
}, "threadRelatedAction").pipe(withStatusesAtom(), withDataAtom(), withCache())

export const usersRelatedAction = reatomAsync(async (ctx) => {
  await sleep(2000)
  return await ctx.schedule(() => getLatestRegUsers(DEFAULT_RELATED_LENGTH))
}, "usersRelatedAction").pipe(withStatusesAtom(), withDataAtom(), withCache())