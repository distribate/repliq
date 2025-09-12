import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { sharedClient } from "#shared/api/forum-client"
import { validateResponse } from "#shared/api/validation"

export type OnlineUsersPayload = Awaited<ReturnType<typeof onlineUsersAction>>

export const onlineUsersAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await sharedClient.shared["online-users"].$get(
      {}, { init: { signal: ctx.controller.signal } }
    )

    return validateResponse<typeof res>(res)
  })
}, {
  name: "onlineUsersAction",
  onFulfill: (ctx, res) => {
    const currentUser = ctx.get(currentUserAtom)
    if (!currentUser) return;

    const CURRENT_USER = { nickname: currentUser.nickname, avatar: currentUser.avatar }

    if (!res) return [CURRENT_USER]

    if ("error" in res) return null

    const converted = res
      .reduce<typeof CURRENT_USER[]>((uniqueUsers, user) => {
        if (!uniqueUsers.some(existingUser => existingUser.nickname === user.nickname)) {
          uniqueUsers.push(user);
        }

        return uniqueUsers
      }, [])
      .concat(res.some(target => target.nickname === currentUser.nickname) ? [] : [CURRENT_USER])

    return converted
  }
}).pipe(withDataAtom(), withStatusesAtom())