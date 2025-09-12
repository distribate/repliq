import { threadClient } from "#shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { getLatestRegUsers } from "#components/widgets/latest-reg-users/models/latest-reg-users.model";
import { validateResponse } from "#shared/api/validation";

const DEFAULT_RELATED_LENGTH = 5

export const threadRelatedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await threadClient.thread["latest-threads"].$get({
      query: { limit: `${DEFAULT_RELATED_LENGTH}` }
    }, {
      init: { signal: ctx.controller.signal }
    })

    return validateResponse<typeof res>(res);
  })
}, {
  name: "threadRelatedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withDataAtom(), withCache({ swr: false }))

export const usersRelatedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getLatestRegUsers(
    { limit: DEFAULT_RELATED_LENGTH },
    { signal: ctx.controller.signal })
  )
}, {
  name: "usersRelatedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withDataAtom(), withCache({ swr: false }))