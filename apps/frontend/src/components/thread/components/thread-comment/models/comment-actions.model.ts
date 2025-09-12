import { threadCommentsDataAtom } from '#components/thread/components/thread-comments/models/thread-comments.model';
import { validateResponse } from '#shared/api/validation';
import { commentClient } from '#shared/api/forum-client';
import { atom, Ctx, reatomAsync, reatomMap, withReset, withStatusesAtom } from '@reatom/framework';

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

const removeCommentActionVariablesAtom = atom<number | null>(null, "removeCommentActionVariables").pipe(withReset())

export const removeCommentAction = reatomAsync(async (ctx, id: number) => {
  removeCommentActionVariablesAtom(ctx, id);

  return await ctx.schedule(async () => {
    const res = await commentClient.comment["remove-comment"].$delete({
      json: {
        comment_id: id,
        parent_type: "thread"
      }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "removeCommentAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const variable = ctx.get(removeCommentActionVariablesAtom)
    if (!variable) return;

    threadCommentsDataAtom(ctx, (state) => {
      if (!state) state = [];

      const newData = state.filter(ex => ex.id !== variable)

      return newData;
    })

    removeCommentActionVariablesAtom.reset(ctx)
  },
  onReject: (ctx, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom())