import { atom, batch, Ctx } from '@reatom/core';
import { AsyncCtx, reatomAsync, withAbort, withStatusesAtom } from '@reatom/async';
import { withReset } from '@reatom/framework';
import { isParamChanged, requestedUserParamAtom } from '#components/profile/models/requested-user.model';
import { userClient } from '#shared/api/forum-client';
import * as z from 'zod';
import { getUserPostsSchema } from '@repo/types/schemas/posts/user-posts-schema.ts';
import { log } from '#shared/utils/log';
import { createFabric } from '#shared/models/infinity-scroll.model';
import { validateResponse } from '#shared/api/validation';

type PostsPayload = NonNullable<Awaited<ReturnType<typeof getPosts>>>

export type PostsPayloadData = PostsPayload["data"]
export type PostsPayloadMeta = PostsPayload["meta"]

export const postsDataAtom = atom<PostsPayloadData | null>(null, "postsData").pipe(withReset())
export const postsMetaAtom = atom<PostsPayloadMeta | null>(null, "postsMeta").pipe(withReset())

export const postsPinnedDataAtom = atom<PostsPayloadData>([], "postsPinnedData")
export const postsNotPinnedDataAtom = atom<PostsPayloadData>([], "postsNotPinnedData")

export const postsAscendingAtom = atom(false, "postsAscending")
export const postsTypeAtom = atom<"created_at" | "views_count">("created_at", "postsType")
export const postsCursorAtom = atom<string | undefined>(undefined, "postsCursor")
export const postsSearchQueryAtom = atom("", "postsSearchQuery")

postsDataAtom.onChange((ctx, state) => {
  if (!state?.length) return

  const { pinned, notPinned } = state.reduce(
    (acc, post) => {
      post.isPinned ? acc.pinned.push(post) : acc.notPinned.push(post)
      return acc
    },
    { pinned: [] as PostsPayloadData, notPinned: [] as PostsPayloadData }
  )

  batch(ctx, () => {
    postsPinnedDataAtom(ctx, pinned)
    postsNotPinnedDataAtom(ctx, notPinned)
  })
})

function resetPosts(ctx: Ctx) {
  batch(ctx, () => {
    postsDataAtom.reset(ctx)
    postsMetaAtom.reset(ctx)
  })
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetPosts(ctx);
  log("posts reset for", state)
}))

type PostsOpts = Omit<z.infer<typeof getUserPostsSchema>, 'currentUserNickname'>

async function getPosts(
  nickname: string,
  { ascending = false, filteringType, cursor, searchQuery }: PostsOpts,
  init?: RequestInit
) {
  const res = await userClient.user['user-posts'][':nickname'].$get({
    param: { nickname },
    query: {
      ascending: ascending.toString(),
      filteringType,
      cursor,
      searchQuery
    },
  }, {
    init
  });

  return validateResponse<typeof res>(res);
}

export const postsAction = reatomAsync(async (ctx) => {
  const nickname = ctx.get(requestedUserParamAtom)
  log("postsAction executed", nickname)
  if (!nickname) return;

  return await ctx.schedule(() => postsFn(ctx, nickname))
}, {
  name: "postsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      postsDataAtom(ctx, res.data)
      postsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom(), withAbort())

async function postsFn(ctx: AsyncCtx, nickname: string) {
  const opts = {
    filteringType: ctx.get(postsTypeAtom),
    ascending: ctx.get(postsAscendingAtom),
    cursor: ctx.get(postsCursorAtom),
    searchQuery: ctx.get(postsSearchQueryAtom)
  }

  const result = await ctx.schedule(
    () => getPosts(nickname, opts, { signal: ctx.controller.signal })
  );

  return result
}

const postsFabric = createFabric<PostsPayloadData[number], PostsPayloadMeta>({
  name: 'profilePosts',
  key: "id",
  fn: (ctx) => {
    const nickname = ctx.get(requestedUserParamAtom)
    if (!nickname) throw new Error("Nickname is not defined")
    return postsFn(ctx, nickname)
  },
  atoms: {
    dataAtom: postsDataAtom,
    metaAtom: postsMetaAtom,
    cursorAtom: postsCursorAtom,
  },
  viewerOpts: {
    threshold: 1
  },
});

export const updatePostsAction = postsFabric.update;
export const ProfilePostsViewer = postsFabric.Viewer;
export const isViewAtom = postsFabric.isViewAtom
export const isExistAtom = postsFabric.isExistAtom