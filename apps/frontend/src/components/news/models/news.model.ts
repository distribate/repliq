import { validateResponse } from "#shared/api/validation";
import { sharedClient } from "#shared/api/forum-client";
import { createFabric } from "#shared/models/infinity-scroll.model";
import { atom, batch } from "@reatom/core";
import { AsyncCtx, reatomAsync, withCache, withReset, withStatusesAtom } from "@reatom/framework";
import { getNewsSchema } from "@repo/types/schemas/news/get-news-schema";
import * as z from "zod";

type NewsPayload = NonNullable<Awaited<ReturnType<typeof getNews>>>;

export type NewsPayloadData = NewsPayload["data"]
export type NewsPayloadMeta = NewsPayload["meta"]

export const newsDataAtom = atom<NewsPayloadData | null>(null, "newsData").pipe(withReset())
export const newsMetaAtom = atom<NewsPayloadMeta | null>(null, "newsMeta").pipe(withReset())
export const newsCursorAtom = atom<string | undefined>(undefined, "newsCursor")
export const newsAscendingAtom = atom(false, "newsAscendind")
export const newsLimitAtom = atom(16, "newsLimit")

async function getNews(
  { ascending, cursor, searchQuery, limit }: z.infer<typeof getNewsSchema>,
  init?: RequestInit
) {
  const res = await sharedClient.shared["news"].$get({
    query: {
      ascending: ascending ? ascending.toString() : undefined,
      cursor,
      searchQuery,
      limit: limit ? limit.toString() : undefined
    }
  }, {
    init
  })

  return validateResponse<typeof res>(res)
}

async function newsFn(ctx: AsyncCtx) {
  const opts = {
    limit: ctx.get(newsLimitAtom),
    ascending: ctx.get(newsAscendingAtom),
    cursor: ctx.get(newsCursorAtom)
  }

  const result = await ctx.schedule(() => getNews(opts, { signal: ctx.controller.signal }))

  return result
}

export const newsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await sharedClient.shared["news"].$get({
      query: {
        cursor: undefined,
        ascending: "false",
        limit: "16",
      }
    }, {
      init: { signal: ctx.controller.signal }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "newsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      newsDataAtom(ctx, res.data)
      newsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withCache())

const newsFabric = createFabric<NewsPayloadData[number], NewsPayloadMeta>({
  name: "news",
  key: "id",
  fn: newsFn,
  atoms: {
    dataAtom: newsDataAtom,
    metaAtom: newsMetaAtom,
    cursorAtom: newsCursorAtom,
  },
  viewerOpts: {
    threshold: 1
  }
})

export const updateNewsAction = newsFabric.update;
export const NewsViewer = newsFabric.Viewer;
export const isViewAtom = newsFabric.isViewAtom
export const isExistAtom = newsFabric.isExistAtom