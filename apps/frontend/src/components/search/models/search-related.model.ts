import { forumThreadClient } from "#shared/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { getLatestRegUsers } from "#components/layout/components/widgets/latest-users/latest-reg-users.model";

const DEFAULT_RELATED_LENGTH = 5

export const threadRelatedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await forumThreadClient.thread["get-latest-threads"].$get(
      { query: { limit: `${DEFAULT_RELATED_LENGTH}` } }, { init: { signal: ctx.controller.signal } }
    )

    const data = await res.json()

    if ("error" in data) throw new Error(data.error);

    return data.data
  })
}, {
  name: "threadRelatedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withDataAtom(), withCache())

export const usersRelatedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getLatestRegUsers(
    DEFAULT_RELATED_LENGTH, { signal: ctx.controller.signal })
  )
}, {
  name: "usersRelatedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withDataAtom(), withCache())