import { reatomResource, withCache, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "#components/user/models/current-user.model"
import { forumSharedClient } from "@repo/shared/api/forum-client"

const getOnlineUsers = async () => {
  const res = await forumSharedClient.shared["get-online-users"].$get()
  const data = await res.json()

  if ("error" in data) return null

  return data.data.length > 0 ? data.data : null;
}

export const onlineUsersResource = reatomResource(async (ctx) => {
  const currentUserNickname = ctx.spy(currentUserAtom)?.nickname
  if (!currentUserNickname) return;

  const res = await ctx.schedule(() => getOnlineUsers())

  if (!res) return [{ nickname: currentUserNickname }]

  if ("error" in res) return null

  const converted = res
  .reduce<{ nickname: string }[]>((uniqueUsers, user) => {
    if (!uniqueUsers.some(existingUser => existingUser.nickname === user.nickname)) {
      uniqueUsers.push(user);
    }

    return uniqueUsers;
  }, [])
  .concat(res.some(user => user.nickname === currentUserNickname) ? [] : [{ nickname: currentUserNickname }])

  return converted
}, "onlineUsersResource").pipe(withDataAtom(), withCache(), withStatusesAtom())