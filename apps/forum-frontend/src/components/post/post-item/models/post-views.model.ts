import { forumPostClient } from '#shared/forum-client';
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';
import { toast } from 'sonner';

export type PostViewsQuery = { id: string } & {
  enabled: boolean;
};

async function getPostViews(id: string) {
  const res = await forumPostClient.post["get-post-viewers"][":id"].$get({ param: { id } })
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)

  return data.data
}

export const postViewsAction = reatomAsync(async (ctx, values: PostViewsQuery) => {
  if (!values.enabled) return;

  return await ctx.schedule(() => getPostViews(values.id))
}, {
  name: "postViewsAction",
  onReject: (_, e) => e instanceof Error && toast.error(e.message)
}).pipe(withDataAtom(), withStatusesAtom(), withCache())