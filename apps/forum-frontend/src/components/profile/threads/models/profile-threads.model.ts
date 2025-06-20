import { atom } from '@reatom/core';
import { reatomAsync, withErrorAtom, withStatusesAtom } from '@reatom/async';
import { forumUserClient } from '@repo/shared/api/forum-client';
import { UserThreads } from './profile-threads-search.model';

export const threadsAtom = atom<UserThreads[] | null>(null, "threads")

type GetThreadsUser = {
  nickname: string;
  query?: string;
};

export async function getThreadsUser({ nickname, query }: GetThreadsUser) {
  const res = await forumUserClient.user["get-user-threads"][":nickname"].$get({
    param: { nickname }, query: { querySearch: query }
  })

  const data = await res.json()

  if (!data || "error" in data) return null;

  return data.data.length ? data.data : null
}

export const threadsAction = reatomAsync(async (ctx, target: string) => {
  return await ctx.schedule(() => getThreadsUser({ nickname: target }))
}, {
  name: "threadsAction",
  onFulfill: (ctx, res) => {
    if (res) {
      threadsAtom(ctx, res)
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())