import type { GetUserPostsResponse } from '@repo/types/routes-types/get-user-posts-types.ts';
import { atom, Ctx } from '@reatom/core';
import { reatomAsync, withStatusesAtom } from '@reatom/async';
import { withReset } from '@reatom/framework';
import { isParamChanged, requestedUserParamAtom } from '#components/profile/main/models/requested-user.model.ts';
import { forumUserClient } from '@repo/shared/api/forum-client.ts';
import { z } from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import { logger } from '@repo/lib/utils/logger.ts';
import { postsFilteringAtom } from './filter-posts.model';

export const postsDataAtom = atom<GetUserPostsResponse["data"] | null>([], "posts").pipe(withReset())
export const postsMetaAtom = atom<GetUserPostsResponse["meta"] | null>(null, "postsMeta").pipe(withReset())

function resetPosts(ctx: Ctx) {
  postsDataAtom.reset(ctx)
  postsMetaAtom.reset(ctx)
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, state, () => { 
  resetPosts(ctx); 
  logger.info("posts reset for", state) 
}))

type GetPosts = Omit<z.infer<typeof getUserPostsSchema>, 'currentUserNickname'> & {
  nickname: string;
}

export async function getPosts({
  nickname, ascending = false, filteringType, cursor, searchQuery
}: GetPosts) {
  const res = await forumUserClient.user['get-user-posts'][':nickname'].$get({
    query: {
      ascending: ascending.toString(), filteringType, cursor, searchQuery
    },
    param: { nickname },
  });

  const data = await res.json();

  if (!data || 'error' in data) return null

  return data;
}

export const postsAction = reatomAsync(async (ctx) => {
  const target = ctx.get(requestedUserParamAtom)
  if (!target) return;

  return await ctx.schedule(() => getPosts({ nickname: target, filteringType: "created_at" }))
}, {
  name: "postsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    postsFilteringAtom(ctx, (state) => ({ ...state, cursor: res.meta.endCursor }))
    postsDataAtom(ctx, res.data)
    postsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom())