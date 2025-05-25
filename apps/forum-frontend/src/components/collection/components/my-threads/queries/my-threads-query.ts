import { getThreadsUser } from "#components/profile/threads/models/profile-threads.model";
import { reatomResource, withDataAtom, withStatusesAtom } from "@reatom/async";
import { currentUserAtom } from "@repo/lib/helpers/get-user";

export const myThreadsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getThreadsUser({ nickname }))
}, "myThreadsResource").pipe(withDataAtom(), withStatusesAtom())