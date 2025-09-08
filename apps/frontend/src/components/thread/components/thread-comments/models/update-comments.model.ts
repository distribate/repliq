import { atom, batch } from "@reatom/core";
import { GetThreadComments, getThreadComments, threadCommentsDataAtom, threadCommentsMetaAtom } from "./thread-comments.model";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { threadParamAtom } from "#components/thread/models/thread.model";

export const isViewAtom = atom(false, "isView")

isViewAtom.onChange((ctx, state) => {
  if (!state) return;

  const hasMore = ctx.get(threadCommentsMetaAtom)?.hasNextPage ?? false;
  if (!hasMore) return;

  updateCommentsAction(ctx)
})

export const isExistAtom = atom((ctx) => {
  const target = ctx.spy(threadCommentsDataAtom)
  return target ? target.length >= 1 : false
}, "isExistAtom")

export const updateCommentsAction = reatomAsync(async (ctx) => {
  const threadId = ctx.get(threadParamAtom)
  if (!threadId) return;
  const meta = ctx.get(threadCommentsMetaAtom)
  const cursor = meta?.endCursor

  const values = {
    cursor,
    threadId
  }

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