import { forumCategoriesClient } from '@repo/shared/api/forum-client.ts';
import { reatomAsync, withDataAtom, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';

async function getCategoryThreads({
  id, limit = 12, cursor, ascending = true
}: {
  id: string,
  limit?: number,
  ascending?: boolean
  cursor?: string
}) {
  const res = await forumCategoriesClient.categories["get-category-threads"][":id"].$get({
    param: { id },
    query: { limit: `${limit}`, ascending: `${ascending}`, cursor }
  })

  const data = await res.json()

  if ("error" in data) return null;

  return data.data;
}

export const cursorAtom = atom<string | null>(null, "categoryThreadCursor")
export const limitAtom = atom<number>(12, "categoryThreadLimit")

export const categoryThreadsAction = reatomAsync(async (ctx, id: string) => {
  const limit = ctx.get(limitAtom)
  const cursor = ctx.get(cursorAtom)

  return await ctx.schedule(() => getCategoryThreads({ id, limit, cursor: cursor ?? undefined }))
}, "categoryThreadsAction").pipe(withDataAtom(), withStatusesAtom())