import { PostEntity } from '@repo/types/entities/entities-type.ts';
import { forumPostClient } from '@repo/shared/api/forum-client';
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from '@reatom/async';

export type PostViewsQuery = Pick<PostEntity, 'id'> & {
  enabled: boolean;
};

async function getPostViews(id: string) {
  const res = await forumPostClient.post["get-post-viewers"][":id"].$get({ param: { id } })
  const data = await res.json();

  if ("error" in data) return null

  return data.data
}

export const postViewsAction = reatomAsync(async (ctx, values: PostViewsQuery) => {
  if (!values.enabled) return;

  return await ctx.schedule(() => getPostViews(values.id))
}).pipe(withDataAtom(), withStatusesAtom(), withCache())