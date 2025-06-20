import { getThreadsUser } from "#components/profile/threads/models/profile-threads.model";
import { currentUserAtom } from "#components/user/models/current-user.model";
import { reatomResource, withDataAtom, withStatusesAtom } from "@reatom/async";
import { forumUserClient } from "@repo/shared/api/forum-client";

export const myThreadsResource = reatomResource(async (ctx) => {
  const nickname = ctx.spy(currentUserAtom)?.nickname
  if (!nickname) return;

  return await ctx.schedule(() => getThreadsUser({ nickname }))
}, "myThreadsResource").pipe(withDataAtom(), withStatusesAtom())

async function getSavedThreads() {
  const res = await forumUserClient.user["get-saved-threads"].$get()
  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data;
}

export const savedThreadsResource = reatomResource(async (ctx) => {
  return await ctx.schedule(() => getSavedThreads())
}, "savedThreadsResource").pipe(withDataAtom(), withStatusesAtom())