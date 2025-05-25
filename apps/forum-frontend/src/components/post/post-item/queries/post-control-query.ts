export type PostControlQuery = {
  isEdit: boolean;
  content: string | null
};

const initial: PostControlQuery = {
  isEdit: false,
  content: null
};

import { Ctx, reatomMap } from '@reatom/framework';

export const postsControlAtom = reatomMap<string, PostControlQuery>();

export const getPostsControlAtom = (ctx: Ctx, postId: string) => {
  return postsControlAtom.getOrCreate(ctx, postId, () => initial);
}

export const editPostsControlAtom = (ctx: Ctx, postId: string, value: Partial<PostControlQuery>) => {
  const current = getPostsControlAtom(ctx, postId)

  return postsControlAtom.set(ctx, postId, { ...current, ...value })
}

export const resetPostsControlAtom = (ctx: Ctx, postId: string) => {
  return postsControlAtom.set(ctx, postId, initial)
}