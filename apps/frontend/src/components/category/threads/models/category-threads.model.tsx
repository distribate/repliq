import { categoriesClient } from '#shared/forum-client.ts';
import { AsyncCtx, reatomAsync, withStatusesAtom } from '@reatom/async';
import { atom, batch, Ctx } from '@reatom/core';
import { categoryIdAtom } from './category.model';
import { withReset } from '@reatom/framework';
import { createFabric } from '../../../../shared/models/infinity-scroll.model';
import { categoryThreadsSortAtom } from './category-filter.model';
import { validateResponse } from '#shared/api/validation';

type CategoryThreadsPayload = Awaited<ReturnType<typeof categoryThreadsAction>>;

type CategoryThreadsPayloadData = CategoryThreadsPayload["data"]
type CategoryThreadsPayloadMeta = CategoryThreadsPayload["meta"]

type CategoryThreadsOpts = {
  asc: boolean,
  limit: number,
  cursor?: string,
  searchQuery?: string,
  type: "created_at" | "views_count"
}

export const categoryThreadsDataAtom = atom<CategoryThreadsPayloadData | null>(null, "categoryThreadsData").pipe(withReset())
export const categoryThreadsMetaAtom = atom<CategoryThreadsPayloadMeta | null>(null, "categoryThreadsMeta").pipe(withReset())

export const categoryThreadsAscendingAtom = atom(false, "categoryThreadsAscending").pipe(withReset())
export const categoryThreadsCursorAtom = atom<string | undefined>(undefined, "categoryThreadsCursor").pipe(withReset())
export const categoryThreadsLimitAtom = atom<number>(16, "categoryThreadsLimit").pipe(withReset())
export const categoryThreadsSearchQueryAtom = atom("", "categoryThreadsSearchQuery").pipe(withReset())

async function getCategoryThreads(
  id: string,
  { asc, cursor, limit, searchQuery, type }: CategoryThreadsOpts,
  init?: RequestInit
) {
  const res = await categoriesClient.category["threads"][":id"].$get({
    param: { id },
    query: { 
      limit: `${limit}`,
      ascending: `${asc}`, 
      cursor,
      searchQuery,
      type
    }
  }, {
    init
  })

  return validateResponse<typeof res>(res)
}

function getOpts(ctx: Ctx) {
  const asc = ctx.get(categoryThreadsAscendingAtom)
  const cursor = ctx.get(categoryThreadsCursorAtom)
  const limit = ctx.get(categoryThreadsLimitAtom)
  const searchQuery = ctx.get(categoryThreadsSearchQueryAtom)
  const type = ctx.get(categoryThreadsSortAtom)

  return { limit, asc, cursor, searchQuery, type }
}

export function resetCategoryThreads(ctx: Ctx) {
  batch(ctx, () => {
    categoryThreadsDataAtom.reset(ctx)
    categoryThreadsMetaAtom.reset(ctx)
  })
}

export const categoryThreadsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => categoryThreadsFn(ctx))
}, {
  name: "categoryThreadsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      categoryThreadsDataAtom(ctx, res.data)
      categoryThreadsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom())

async function categoryThreadsFn(ctx: AsyncCtx) {
  const id = ctx.get(categoryIdAtom);
  const opts = getOpts(ctx)

  const result = await ctx.schedule(
    () => getCategoryThreads(id, opts, { signal: ctx.controller.signal })
  );

  return result
}

const categoryThreadsFabric = createFabric<CategoryThreadsPayloadData[number], CategoryThreadsPayloadMeta>({
  name: 'categoryThreads',
  fn: categoryThreadsFn,
  atoms: {
    dataAtom: categoryThreadsDataAtom,
    metaAtom: categoryThreadsMetaAtom,
    cursorAtom: categoryThreadsCursorAtom
  },
  viewerOpts: {
    threshold: 1
  },
  key: "id"
});

export const updateCategoryThreadsAction = categoryThreadsFabric.update;
export const CategoryThreadsViewer = categoryThreadsFabric.Viewer;
export const isViewAtom = categoryThreadsFabric.isViewAtom
export const isExistAtom = categoryThreadsFabric.isExistAtom