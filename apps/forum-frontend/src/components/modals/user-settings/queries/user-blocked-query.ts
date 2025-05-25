import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';

async function getUserBlocked() {
  const res = await forumUserClient.user["get-blocked-users"].$get({
    query: { cursor: undefined }
  })
  
  const data = await res.json()

  if ("error" in data) return null

  return data.data.length ? data.data : null
}

export const userBlockedAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUserBlocked())
}, "userBlockedAction").pipe(withDataAtom(), withStatusesAtom())