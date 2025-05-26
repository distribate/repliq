type PostControl = {
  isEdit: boolean;
  content: string | null
};

const initial: PostControl = {
  isEdit: false,
  content: null
};

import { Ctx, reatomMap } from '@reatom/framework';

export const postsControlAtom = reatomMap<string, PostControl>();

export const getPostsControlAtom = (ctx: Ctx, postId: string) => {
  return postsControlAtom.getOrCreate(ctx, postId, () => initial);
}

export const editPostsControlAtom = (ctx: Ctx, postId: string, value: Partial<PostControl>) => {
  const current = getPostsControlAtom(ctx, postId)

  return postsControlAtom.set(ctx, postId, { ...current, ...value })
}