import { reatomAsync, withDataAtom, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { userClient } from '#shared/forum-client';
import { isParamChanged, requestedUserParamAtom } from '#components/profile/main/models/requested-user.model';
import { logger } from '@repo/shared/utils/logger.ts';

export async function getThreadsUser(
  nickname: string,
  { query }: { query?: string } = { }
) {
  const res = await userClient.user["get-user-threads"][":nickname"].$get(
    { param: { nickname }, query: { querySearch: query } }
  )

  const data = await res.json()
  
  if ("error" in data) throw new Error(data.error)

  return data.data
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  threadsAction.dataAtom.reset(ctx)
  logger.info("threads reset for", state)
}))

export const threadsAction = reatomAsync(async (ctx, target: string) => {
  // @ts-ignore
  return await ctx.schedule(() => getThreadsUser(target))
}, {
  name: "threadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom(), withDataAtom())