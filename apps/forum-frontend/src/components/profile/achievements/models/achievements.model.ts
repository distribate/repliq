import { isParamChanged, requestedUserParamAtom } from "#components/profile/main/models/requested-user.model"
import { reatomAsync, withErrorAtom, withStatusesAtom } from "@reatom/async"
import { atom, Ctx } from "@reatom/core"
import { withReset } from "@reatom/framework"
import { logger } from "@repo/lib/utils/logger"
import { achievementsClient } from "@repo/shared/api/minecraft-client"

type AchievementsData = Array<{
  type: "lobby" | "bisquite" | "main";
  details: { img: string; title: string; description: string; }
}> | null

type AchievementsMeta = {
  total: number;
  achievementsTypes: Array<{  key: string; title: string }>
} | null

export const achievementsAtom = atom<AchievementsData>(null, "achievements").pipe(withReset())
export const achievementsMetaAtom = atom<AchievementsMeta>(null, "achievementsMeta").pipe(withReset())

async function getAchievements(nickname: string) {
  const res = await achievementsClient.achievements["get-achievements"][":nickname"].$get({ param: { nickname } })
  const data = await res.json()

  if (!data || "error" in data) return null

  return data.data
}

async function getAchievementsMeta() {
  const res = await achievementsClient.achievements["get-achievements-meta"].$get()
  const data = await res.json()

  if (!data || "error" in data) return null

  return data.data
}

requestedUserParamAtom.onChange((ctx, state) => {
  if (!state) {
    logger.info(`achievements reset`)
    achievementsAtom.reset(ctx)
    achievementsMetaAtom.reset(ctx)
  }
})

function resetAchievements(ctx: Ctx) {
  achievementsAtom.reset(ctx)
  achievementsMetaAtom.reset(ctx)
}

requestedUserParamAtom.onChange((ctx, state) => isParamChanged(ctx, requestedUserParamAtom, state, () => {
  resetAchievements(ctx)
  logger.info("achievements reset for", state)
}))

export const achievementsAction = reatomAsync(async (ctx) => {
  const target = ctx.get(requestedUserParamAtom)
  if (!target) return;

  const cachedData = ctx.get(achievementsAtom)
  const cachedMeta = ctx.get(achievementsMetaAtom)

  if (cachedData && cachedMeta) {
    const cache = Promise.resolve([cachedData, cachedMeta] as [AchievementsData, AchievementsMeta])
    logger.info(`returned cached data for ${target}: `, cache)
    return cache
  }

  return await ctx.schedule(() => Promise.all([getAchievements(target), getAchievementsMeta()]))
}, {
  name: "achievementsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    const [data, meta] = res

    if (res) {
      achievementsAtom(ctx, data)
      achievementsMetaAtom(ctx, meta)
    }
  }
}).pipe(withStatusesAtom(), withErrorAtom())