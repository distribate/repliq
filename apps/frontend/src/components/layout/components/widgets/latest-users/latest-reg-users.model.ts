import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';
import { sharedClient } from "#shared/forum-client.ts";

export const getLatestRegUsers = async (
  limit?: number,
  init?: RequestInit
) => {
  const res = await sharedClient.shared["get-latest-reg-users"].$get(
    { query: { limit: limit ? `${limit}` : undefined } }, { init }
  )

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.data
};

export const latestUsersAction = reatomAsync(async (ctx, options?: { limit: number }) => {
  return await ctx.schedule(() => getLatestRegUsers(
    options?.limit, { signal: ctx.controller.signal })
  )
}, "latestUsersAction").pipe(withStatusesAtom(), withDataAtom())