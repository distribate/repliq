import { postClient } from '#shared/forum-client';
import { reatomAsync, withCache, withStatusesAtom } from '@reatom/async';
import { atom } from '@reatom/core';
import { withReset } from '@reatom/framework';
import { toast } from 'sonner';

type PostViewer = {
  nickname: string;
  created_at: string;
  avatar: string | null;
  name_color: string;
  is_donate: boolean;
}

export const postViewsDataAtom = atom<PostViewer[] | null>(null, "postsViewsData").pipe(withReset())
export const postViewsMetaAtom = atom<{ count: number } | null>(null, "postViewsMeta").pipe(withReset())

async function getPostViews(id: string) {
  const res = await postClient.post["get-post-viewers"][":id"].$get({ param: { id } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)
  return data.data
}

export const postViewsAction = reatomAsync(async (ctx, id: string) => {
  return await ctx.schedule(() => getPostViews(id))
}, {
  name: "postViewsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    postViewsDataAtom(ctx, res.data)
    postViewsMetaAtom(ctx, res.meta)
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      toast.error(e.message)
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withCache())