import { lpDB } from "#shared/database/lp-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod/v4";

// example permission's name:
// lobby = "lobby.*"
// bisquite = "bisquite.*"
// main = "main.*"

type AchievementDetails = {
  title: string,
  description: string,
  img: string | null
}

export const ACHIEVEMENTS_RAW: Record<string, AchievementDetails> = {
  "lobby.secret.parkour": {
    title: "Секретный паркур",
    description: "Найти и пройти секретный паркур",
    img: "barrier.webp"
  },
  "main.integration.telegram": {
    title: "Вместе с Telegram",
    description: "Привязать свой аккаунт к Telegram",
    img: "allay_spawn_egg.webp"
  }
}

async function getAchievementDetails(achievement: string) {
  const v = ACHIEVEMENTS_RAW[achievement]

  const publicImage = `https://kong.fasberry.su/storage/v1/object/public/static/achievements/${v.img}`

  return { ...v, img: publicImage }
}

const achievementsSchema = z.enum(["lobby", "bisquite", "main"])

type AchievementType = z.infer<typeof achievementsSchema>

async function getAchievements(nickname: string) {
  const query = await lpDB
    .selectFrom("luckperms_user_permissions")
    .innerJoin(
      "luckperms_players",
      "luckperms_players.uuid",
      "luckperms_user_permissions.uuid",
    )
    .select(["permission"])
    .where("luckperms_players.username", "=", nickname)
    .where(eb =>
      eb.and([
        eb.or(
          achievementsSchema.options.map(option =>
            eb("luckperms_user_permissions.permission", "like", `${option}%`)
          )
        ),
        eb("luckperms_user_permissions.value", "=", true)
      ])
    )
    .execute()

  const res = await Promise.all(query.map(async perm => {
    const details = await getAchievementDetails(perm.permission)
    const firstKey = perm.permission.split(".")[0]

    return {
      type: firstKey as AchievementType,
      details
    }
  }))

  return res
}

async function getAchievementsMeta() {
  return {
    total: 2,
    achievementsTypes: [
      { key: "main", title: "Основное" },
      { key: "lobby", title: "Лобби" },
      { key: "bisquite", title: "Bisquite" },
    ]
  }
}

export const getAchievementsMetaRoute = new Hono()
  .get("/get-achievements-meta", async (ctx) => {
    try {
      const meta = await getAchievementsMeta()

      return ctx.json({ data: meta }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })

export const getAchievementsRoute = new Hono()
  .get("/get-achievements/:nickname", async (ctx) => {
    const { nickname } = ctx.req.param()

    try {
      const achievements = await getAchievements(nickname)

      return ctx.json({ data: achievements }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })