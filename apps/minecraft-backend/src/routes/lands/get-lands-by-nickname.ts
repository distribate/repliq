import { forumDB } from "#shared/database/forum-db.ts";
import { landsDB } from "#shared/database/lands-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

async function getLandsByNickname(nickname: string) {
  const query = await landsDB
    .selectFrom("lands_players")
    .innerJoin("lands_lands", "lands_players.edit_land", "lands_lands.ulid")
    .select([
      "lands_lands.area",
      "lands_lands.name",
      "lands_lands.members",
      "lands_lands.type",
      "lands_lands.created_at",
      "lands_lands.title",
      "lands_lands.ulid"
    ])
    .where("lands_players.name", "=", nickname)
    .execute();

  const lands = await Promise.all(query.map(async (land) => {
    let rawMembers: { [key: string]: { chunks: number } } = JSON.parse(land.members);

    const members = await Promise.all(Object.keys(rawMembers).map(async (member) => {
      const { name: nickname } = await landsDB
        .selectFrom("lands_players")
        .select("name")
        .where("uuid", "=", member)
        .executeTakeFirstOrThrow();

      return {
        uuid: member,
        nickname
      }
    }))

    return {
      ...land,
      area: JSON.parse(land.area),
      members
    }
  }))

  return lands;
}

const getLandsByNicknameSchema = z.object({
  exclude: z.string().optional()
})

export const getLandsByNicknameRoute = new Hono()
  .get("/get-user-lands/:nickname", zValidator("query", getLandsByNicknameSchema), async (ctx) => {
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

    // if !user in forum then show own lands

    try {
      let lands = await getLandsByNickname(nickname)

      if (exclude) {
        lands = lands.filter((land) => land.ulid !== exclude)
      }

      return ctx.json({ data: lands }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })