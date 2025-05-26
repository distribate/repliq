import { forumUserClient } from "@repo/shared/api/forum-client";
import { reatomAsync, withCache, withDataAtom } from "@reatom/async";
import { currentUserNicknameAtom } from "@repo/lib/helpers/get-user";
import consola from "consola";

async function getFriendsCount(nickname: string) {
  const res = await forumUserClient.user["get-user-friends-count"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data
}

export const friendsCountAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(currentUserNicknameAtom)
  if (!nickname) return;

  return await ctx.schedule(() => getFriendsCount(nickname))
}, "friendsCountAction").pipe(withDataAtom(), withCache())

friendsCountAction.dataAtom.onChange((_, state) => consola.info("friendsCountAction.dataAtom", state))