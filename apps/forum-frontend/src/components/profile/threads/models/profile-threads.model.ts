import { atom } from '@reatom/core';
import { reatomAsync, withDataAtom, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { forumUserClient } from '#shared/forum-client';

type GetThreadsUser = {
  query?: string;
};

export async function getThreadsUser(
  nickname: string,
  { query }: GetThreadsUser = { }
) {
  const res = await forumUserClient.user["get-user-threads"][":nickname"].$get({ param: { nickname }, query: { querySearch: query } })
  const data = await res.json()
  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const threadsAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getThreadsUser(target))
}, {
  name: "threadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom(), withDataAtom(null))