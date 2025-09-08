import { threadOwnerAtom, threadParamAtom } from "#components/thread/models/thread.model"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom, AtomState, Ctx, sleep, withReset } from "@reatom/framework"
import { threadClient } from "#shared/forum-client"
import { isParamChanged } from "#components/profile/main/models/requested-user.model"
import { validateResponse } from "#shared/api/validation"

type ThreadRecommendationsPayload = NonNullable<ReturnType<Awaited<typeof threadRecommendationsAction>["onFulfill"]>>

export const threadRecommendationsDataAtom = atom<ThreadRecommendationsPayload["data"] | null>(null, "threadRecommendationsData").pipe(withReset())
export const threadRecommendationsMetaAtom = atom<ThreadRecommendationsPayload["meta"] | null>(null, "threadRecommendationsMeta").pipe(withReset())

export function resetThreadRecommendations(ctx: Ctx) {
  threadRecommendationsDataAtom.reset(ctx)
  threadRecommendationsMetaAtom.reset(ctx)
}

threadParamAtom.onChange((ctx, state) => isParamChanged(ctx, threadParamAtom, state, () => {
  threadRecommendationsAction(ctx)
}))

export const threadRecommendationsAction = reatomAsync(async (ctx) => {
  const target = ctx.get(threadOwnerAtom)
  const threadId = ctx.get(threadParamAtom)
  if (!target || !threadId) return;

  await ctx.schedule(() => sleep(100))

  return await ctx.schedule(async () => {
    const res = await threadClient.thread["by-owner"][":nickname"].$get({
      param: { nickname: target.nickname }, query: { exclude: threadId }
    })

    return validateResponse<typeof res>(res)
  })
}, {
  name: "threadRecommendationsAction",
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
  onFulfill: (ctx, res) => {
    if (!res) return;

    threadRecommendationsDataAtom(ctx, res.data)
    threadRecommendationsMetaAtom(ctx, res.meta)
  }
}).pipe(withStatusesAtom())