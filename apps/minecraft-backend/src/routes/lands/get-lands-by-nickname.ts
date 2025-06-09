import { forumDB } from "#shared/database/forum-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { getLandsByNickname } from "#lib/queries/get-lands-by-nickname.ts";

const getLandsByNicknameSchema = z.object({
  exclude: z.string().optional()
})

export const getPlayerLandsRoute = new Hono()
  .get("/get-player-lands/:nickname", zValidator("query", getLandsByNicknameSchema), async (ctx) => {
    const { nickname } = ctx.req.param()
    const { exclude } = getLandsByNicknameSchema.parse(ctx.req.query())

    const userPreference = await forumDB
      .selectFrom("users_settings")
      .select("game_stats_visible")
      .where("users_settings.nickname", "=", nickname)
      .executeTakeFirst();

    if (userPreference && !userPreference.game_stats_visible) {
      return ctx.json({ error: "User hide this information"}, 401)
    }

    try {
      let lands = await getLandsByNickname(nickname)

      if (!lands) {
        return ctx.json({ data: [] }, 404)
      }

      if (exclude) {
        lands = lands.filter(land => land.ulid !== exclude)
      }

      return ctx.json({ data: lands }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })