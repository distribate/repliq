import { categoriesClient } from '#shared/forum-client.ts';
import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';

type GetCategoryThreads = {
  id: string,
  limit?: number,
  ascending?: boolean
  cursor?: string
}

async function getCategoryThreads({
  id, limit, cursor, ascending = true
}: GetCategoryThreads) {
  const res = await categoriesClient.categories["get-category-threads"][":id"].$get({
    param: { id },
    query: { limit: `${limit}`, ascending: `${ascending}`, cursor }
  })

  const data = await res.json()

  if ("error" in data) throw new Error(data.error)

  return data.data;
}

export const categoryThreadsAscendingAtom = atom(false, "categoryThreadsAscending")
export const categoryThreadsCursorAtom = atom<string | undefined>(undefined, "categoryThreadsCursor")
export const categoryThreadsLimitAtom = atom<number>(12, "categoryThreadsLimit")

export const categoryThreadsAction = reatomAsync(async (ctx, id: string) => {
  const limit = ctx.get(categoryThreadsLimitAtom)
  const cursor = ctx.get(categoryThreadsCursorAtom)

  return await ctx.schedule(() => getCategoryThreads({ id, limit, cursor }))
}, {
  name: "categoryThreadsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withDataAtom(), withStatusesAtom())