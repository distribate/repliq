import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';
import { sharedClient } from "#shared/api/forum-client";
import { validateResponse } from '#shared/api/validation';

export type LatestRegUsersPayload = Awaited<ReturnType<typeof getLatestRegUsers>>

type LatestRegOpts = { limit: number, }

export const getLatestRegUsers = async (
  { limit }: LatestRegOpts,
  init?: RequestInit
) => {
  const res = await sharedClient.shared["latest-reg-users"].$get(
    { query: { limit: limit ? `${limit}` : undefined } }, { init }
  )

  return validateResponse<typeof res>(res);
};

export const latestUsersAction = reatomAsync(async (ctx, options: LatestRegOpts) => {
  return await ctx.schedule(() => getLatestRegUsers(
    { limit: options.limit },
    { signal: ctx.controller.signal })
  )
}, "latestUsersAction").pipe(withStatusesAtom(), withDataAtom())