import { threadOwnerAtom, threadParamAtom } from "#components/thread/models/thread.model"
import { reatomAsync, withStatusesAtom } from "@reatom/async"
import { atom, AtomState, Ctx, sleep, withReset } from "@reatom/framework"
import { forumThreadClient } from "#shared/forum-client"
import { isParamChanged } from "#components/profile/main/models/requested-user.model"

type Response = NonNullable<ReturnType<Awaited<typeof threadRecommendationsAction>["onFulfill"]>>

export const threadRecommendationsDataAtom = atom<Response["data"] | null>(null, "threadRecommendationsData").pipe(withReset())
export const threadRecommendationsMetaAtom = atom<Response["meta"] | null>(null, "threadRecommendationsMeta").pipe(withReset())

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
    const res = await forumThreadClient.thread["get-threads-by-owner"][":nickname"].$get({
      param: { nickname: target.nickname }, query: { exclude: threadId }
    })

    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data
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