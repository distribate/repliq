import { GetThreadComments, getThreadComments, threadCommentsDataAtom, threadCommentsMetaAtom } from "./thread-comments.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";

export const updateCommentsAction = reatomAsync(async (ctx, values: GetThreadComments) => {
  return await ctx.schedule(() => getThreadComments(values))
}, {
  name: "updateCommentsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    threadCommentsDataAtom(ctx, (state) => {
      if (!state) state = []

      return res.data.filter(comment => !state.some(exist => exist.id === comment.id))
    })
    
    threadCommentsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom())