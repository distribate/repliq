import { forumUserClient } from "@repo/shared/api/forum-client";
import { reatomResource, withDataAtom, withStatusesAtom } from "@reatom/async";
import { currentUserAtom } from "@repo/lib/helpers/get-user";

const getReferals = async (nickname: string) => {
  const res = await forumUserClient.user["get-user-referals"][":nickname"].$get({  param: { nickname }})
  const data = await res.json()

  if ("error" in data) return null

  return data.data.length > 0 ? data.data : null
}

export const myReferalsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getReferals(nickname))
}, "myReferalsResource").pipe(withDataAtom(), withStatusesAtom())