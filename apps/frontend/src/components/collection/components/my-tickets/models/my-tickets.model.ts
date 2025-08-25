import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { forumUserClient } from "#shared/forum-client"

export const myTicketsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(async () => {
    const res = await forumUserClient.user["get-user-tickets"][":nickname"].$get({ param: { nickname } })
    const data = await res.json()

    if ("error" in data) return null

    return data.data
  })
}, {
  name: "myTicketsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())