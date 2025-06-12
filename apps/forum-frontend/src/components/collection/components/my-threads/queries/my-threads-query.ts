import { getThreadsUser } from "#components/profile/threads/models/profile-threads.model";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { reatomResource, withDataAtom, withStatusesAtom } from "@reatom/async";

export const myThreadsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getThreadsUser({ nickname }))
}, "myThreadsResource").pipe(withDataAtom(), withStatusesAtom())