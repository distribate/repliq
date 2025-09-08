import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model"
import { log } from "#lib/utils"
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/async"
import { atom, batch, Ctx } from "@reatom/core"
import { withReset } from "@reatom/framework"
import ky from "ky"

type AchievementsData = Array<{
  type: "lobby" | "bisquite" | "main";
  details: { img: string; title: string; description: string; }
}> | null

type AchievementsMeta = {
  total: number;
  achievementsTypes: Array<{ key: string; title: string }>
} | null

export const achievementsAtom = atom<AchievementsData>(null, "achievements").pipe(withReset())
export const achievementsMetaAtom = atom<AchievementsMeta>(null, "achievementsMeta").pipe(withReset())

const PREFIX_URL = `https://api.fasberry.su/minecraft/server/`

function resetAchievements(ctx: Ctx) {
  achievementsAtom.reset(ctx)
  achievementsMetaAtom.reset(ctx)
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetAchievements(ctx)
  log("achievements reset for", state)
}))

export const achievementsAction = reatomAsync(async (ctx) => {
  const target = ctx.get(requestedUserParamAtom)
  if (!target) return;

  const cachedData = ctx.get(achievementsAtom)
  const cachedMeta = ctx.get(achievementsMetaAtom)

  if (cachedData && cachedMeta) {
    const cache = Promise.resolve([cachedData, cachedMeta] as [AchievementsData, AchievementsMeta])
    return cache
  }

  async function getAchievements(nickname: string) {
    const res = await ky(`achievements/${nickname}`, { prefixUrl: PREFIX_URL, signal: ctx.controller.signal })
    const data = await res.json<WrappedResponse<AchievementsData>>()
    if ("error" in data) throw new Error(data.error)
    return data.data
  }

  async function getAchievementsMeta() {
    const res = await ky(`achievements-meta`, { prefixUrl: PREFIX_URL, signal: ctx.controller.signal })
    const data = await res.json<WrappedResponse<AchievementsMeta>>()
    if ("error" in data) throw new Error(data.error)
    return data.data
  }

  return await ctx.schedule(() => Promise.all([getAchievements(target), getAchievementsMeta()]))
}, {
  name: "achievementsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const [data, meta] = res
    
    batch(ctx, () => {
      achievementsAtom(ctx, data)
      achievementsMetaAtom(ctx, meta)
    })
  }
}).pipe(withStatusesAtom(), withErrorAtom())