import { validateResponse } from '#shared/api/validation';
import { postClient } from '#shared/api/forum-client';
import { reatomAsync, withCache, withStatusesAtom } from '@reatom/async';
import { atom, batch, Ctx } from '@reatom/core';
import { withReset } from '@reatom/framework';
import { toast } from 'sonner';
import { createFabric } from '#shared/models/infinity-scroll.model';

type PostViewsPayload = Awaited<ReturnType<typeof getPostViews>>

type PostViewsPayloadData = PostViewsPayload["data"]
type PostViewsPayloadMeta = PostViewsPayload["meta"]

export const postViewsDataAtom = atom<PostViewsPayloadData | null>(null, "postsViewsData").pipe(withReset())
export const postViewsMetaAtom = atom<PostViewsPayloadMeta | null>(null, "postViewsMeta").pipe(withReset())

export const postViewsCursorAtom = atom<string | undefined>(undefined, "postViewsCursor")

postViewsMetaAtom.onChange((ctx, state) => {
  if (!state) return;

  postViewsCursorAtom(ctx, state.endCursor)
})

async function getPostViews(id: string, { cursor }: { cursor?: string }) {
  const res = await postClient.post["viewers"][":id"].$get(
    { param: { id }, query: { cursor } }
  )

  return validateResponse<typeof res>(res);
}

async function postViewsFn(ctx: Ctx, id: string) {
  const opts = {
    cursor: ctx.get(postViewsCursorAtom)
  }

  const result = await ctx.schedule(() => getPostViews(id, opts))

  return result;
}

export const postViewsAction = reatomAsync(async (ctx, id: string) => {
  return await ctx.schedule(() => postViewsFn(ctx, id))
}, {
  name: "postViewsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      postViewsDataAtom(ctx, res.data)
      postViewsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withCache())