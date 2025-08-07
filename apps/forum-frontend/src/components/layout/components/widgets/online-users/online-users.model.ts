import { reatomAsync, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { forumSharedClient } from "#shared/forum-client"

const getOnlineUsers = async () => {
  const res = await forumSharedClient.shared["get-online-users"].$get()
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const onlineUsersAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getOnlineUsers())
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