import { atom, Ctx, CtxSpy, reatomMap } from '@reatom/framework';

type PostControl = {
  isEdit: boolean;
  content: string | null
};

const initial: PostControl = {
  isEdit: false,
  content: null
};

export const postsControlAtom = atom<Record<string, PostControl>>({}, "postsControl");

export const postsControlAtomV2 = reatomMap<string, PostControl>()
export const getPostsControlAtomV2 = (ctx: CtxSpy | Ctx, id: string) =>
  postsControlAtomV2.getOrCreate(ctx, id, () => initial)
export const editPostsControlAtomV2 = (ctx: Ctx, id: string, value: Partial<PostControl>) =>
  postsControlAtomV2.set(ctx, id, { ...getPostsControlAtomV2(ctx, id), ...value })

export const getPostsControlAtom = (ctx: CtxSpy | Ctx, id: string): PostControl => {
  const state = ctx.spy ? ctx.spy(postsControlAtom) ?? {} : ctx.get(postsControlAtom)
  return state[id] ?? initial
}

export const editPostsControlAtom = (ctx: Ctx, id: string, value: Partial<PostControl>): void => {
  postsControlAtom(ctx, (state) => ({
    ...state,
    [id]: { ...state[id] ?? initial, ...value },
  }))
}