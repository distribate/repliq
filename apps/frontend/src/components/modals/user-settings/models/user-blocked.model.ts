import { userClient } from '#shared/forum-client.ts';
import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';

export const userBlockedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await userClient.user["get-blocked-users"].$get({ query: { cursor: undefined } })
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data
  })
}, {
  name: "userBlockedAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())