import { Ctx, reatomMap } from '@reatom/framework';

type CommentActions = {
  isEdit: boolean;
};

const initial: CommentActions = {
  isEdit: false,
};

export const commentsActionsAtom = reatomMap<number, CommentActions>();

export const getCommentActionsAtom = (ctx: Ctx, commentId: number) => {
  return commentsActionsAtom.getOrCreate(ctx, commentId, () => initial);
}

export const editCommentActionsAtom = (ctx: Ctx, commentId: number, value: CommentActions) => {
  return commentsActionsAtom.set(ctx, commentId, value)
}