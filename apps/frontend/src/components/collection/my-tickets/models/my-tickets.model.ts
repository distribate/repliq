import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { userClient } from "#shared/api/forum-client"
import { validateResponse } from "#shared/api/validation"

export const myTicketsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(async () => {
    const res = await userClient.user["user-tickets"].$get()
    return validateResponse<typeof res>(res);
  })
}, {
  name: "myTicketsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())