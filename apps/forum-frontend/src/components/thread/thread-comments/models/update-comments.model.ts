import { batch } from "@reatom/core";
import { GetThreadComments, getThreadComments, threadCommentsDataAtom, threadCommentsMetaAtom } from "./thread-comments.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";

export const updateCommentsAction = reatomAsync(async (ctx, values: GetThreadComments) => {
  return await ctx.schedule(() => getThreadComments(values))
}, {
  name: "updateCommentsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      threadCommentsDataAtom(ctx, (state) => {
        if (!state) state = []
  
        return res.data.filter(comment => !state.some(exist => exist.id === comment.id))
      })
      
      threadCommentsMetaAtom(ctx, res.meta)
    })
  }
}).pipe(withStatusesAtom())