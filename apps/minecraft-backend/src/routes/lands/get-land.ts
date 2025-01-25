import { landsDB } from "#shared/database/lands-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";

async function getLand(id: string) {
  const query = await landsDB
    .selectFrom("lands_players")
    .innerJoin("lands_lands", "lands_players.edit_land", "lands_lands.ulid")
    .innerJoin("lands_lands_claims", "lands_lands_claims.land", "lands_lands.ulid")
    .select([
      "lands_lands.area",
      "lands_lands.name",
      "lands_lands.members",
      "lands_lands.type",
      "lands_lands.created_at",
      "lands_lands.title",
      "lands_lands.stats",
      "lands_lands.balance",
      "lands_lands.limits",
      "lands_lands.level",
      "lands_lands_claims.chunks_amount",
      "lands_lands_claims.areas_amount"
    ])
    .where("ulid", "=", id)
    .executeTakeFirstOrThrow()

  const land = {
    ...query,
    limits: query.limits ? JSON.parse(query.limits) : null,
    stats: query.stats ? JSON.parse(query.stats) : null,
    area: JSON.parse(query.area),
    members: await Promise.all(Object.keys(JSON.parse(query.members)).map(async (member) => {
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
  }

  return land
}

export const getLandRoute = new Hono()
  .get("/get-land/:id", async (ctx) => {
    const { id } = ctx.req.param()

    try {
      const land = await getLand(id)

      return ctx.json(land, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })
