import { userClient } from "#shared/forum-client";
import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async";
import { currentUserAtom } from "#components/user/models/current-user.model";

export const myReferalsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(async () => {
    const res = await userClient.user["get-user-referals"][":nickname"].$get({ param: { nickname } })
    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data.data
  })
}, {
  name: "myReferalsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())