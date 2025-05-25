import { reatomResource, withDataAtom, withStatusesAtom } from "@reatom/async"
import { currentUserAtom } from "@repo/lib/helpers/get-user"
import { forumUserClient } from "@repo/shared/api/forum-client"

async function getTickets(nickname: string) {
  const res = await forumUserClient.user["get-user-tickets"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if ("error" in data) return null

  return data.data
}

export const myTicketsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getTickets(nickname))
}, "myTicketsResource").pipe(withDataAtom(), withStatusesAtom())