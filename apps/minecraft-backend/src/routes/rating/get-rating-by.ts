import { Hono } from "hono";
import { z } from "zod/v4";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { executeWithCursorPagination } from "kysely-paginate";
import { playerPointsDB } from "#shared/database/playerpoints-db.ts";
import { bisquiteDB } from "#shared/database/bisquite-db.ts";
import { reputationDB } from "#shared/database/reputation-db.ts";
import { lobbyDB } from "#shared/database/lobby-db.ts";

const getRatingBySchema = z.object({
  type: z.enum(["charism", "belkoin", "lands_chunks", "reputation", "playtime", "parkour"]),
  limit: z.string().transform(Number).optional(),
  cursor: z.string().optional(),
  ascending: z.string().transform((val) => val === "true").optional(),
})

const DEFAULT_LIMIT = 50

async function getRatingBy({
  type, ascending, cursor, limit = DEFAULT_LIMIT
}: z.infer<typeof getRatingBySchema>) {
  const direction = ascending ? "asc" : "desc"

  switch (type) {
    case "parkour":
      const parkourQuery = lobbyDB
        .selectFrom("ajparkour_scores")
        .innerJoin("ajparkour_players", "ajparkour_players.id", "ajparkour_scores.player")
        .select([
          "ajparkour_players.gamesplayed",
          "ajparkour_scores.player",
          "ajparkour_scores.score",
          "ajparkour_players.name",
          "ajparkour_scores.area"
        ])
        .where("ajparkour_scores.area", "!=", "overall") // overall - scores from all areas

      const parkourRes = await executeWithCursorPagination(parkourQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "score", direction, expression: "score" }
        ],
        parseCursor: (cursor) => ({ score: Number(cursor.score) })
      })

      return {
        data: parkourRes.rows,
        meta: {
          hasNextPage: parkourRes.hasNextPage,
          hasPrevPage: parkourRes.hasPrevPage,
          startCursor: parkourRes.startCursor,
          endCursor: parkourRes.endCursor,
        }
      }
    case "charism":
      const charismQuery = bisquiteDB
        .selectFrom("CMI_users")
        .select(["Balance", "username"])

      const charismRes = await executeWithCursorPagination(charismQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "Balance", direction, expression: "Balance" }
        ],
        parseCursor: (cursor) => ({ Balance: Number(cursor.Balance) })
      })

      return {
        data: charismRes.rows,
        meta: {
          hasNextPage: charismRes.hasNextPage,
          hasPrevPage: charismRes.hasPrevPage,
          startCursor: charismRes.startCursor,
          endCursor: charismRes.endCursor,
        }
      }
    case "belkoin":
      const belkoinQuery = playerPointsDB
        .selectFrom("playerpoints_points")
        .innerJoin("playerpoints_username_cache", "playerpoints_points.uuid", "playerpoints_username_cache.uuid")
        .select([
          "playerpoints_points.points",
          "playerpoints_username_cache.username"
        ])

      const belkoinRes = await executeWithCursorPagination(belkoinQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "points", direction, expression: "points" }
        ],
        parseCursor: (cursor) => ({ points: Number(cursor.points) })
      })

      return {
        data: belkoinRes.rows,
        meta: {
          hasNextPage: belkoinRes.hasNextPage,
          hasPrevPage: belkoinRes.hasPrevPage,
          startCursor: belkoinRes.startCursor,
          endCursor: belkoinRes.endCursor,
        }
      }
    case "lands_chunks":
      const landsQuery = bisquiteDB
        .selectFrom("lands_lands_claims")
        .innerJoin("lands_lands", "lands_lands_claims.land", "lands_lands.ulid")
        .select([
          "lands_lands_claims.land",
          "lands_lands_claims.chunks_amount",
          "lands_lands_claims.blocks",
          "lands_lands.name",
          "lands_lands.members",
          "lands_lands.type"
        ])

      let landsRes = await executeWithCursorPagination(landsQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "chunks_amount", direction, expression: "chunks_amount" }
        ],
        parseCursor: (cursor) => ({ chunks_amount: Number(cursor.chunks_amount) })
      })

      landsRes.rows = landsRes.rows.map((item) => {
        return {
          ...item,
          members: JSON.parse(item.members),
          chunks_amount: Number(item.chunks_amount),
          blocks: item.blocks ? JSON.parse(item.blocks) : null,
        }
      })

      return {
        data: landsRes.rows,
        meta: {
          hasNextPage: landsRes.hasNextPage,
          hasPrevPage: landsRes.hasPrevPage,
          startCursor: landsRes.startCursor,
          endCursor: landsRes.endCursor,
        }
      }
    case "reputation":
      const reputationQuery = reputationDB
        .selectFrom("reputation")
        .select(["reputation", "reputation.uuid"])

      const reputationRes = await executeWithCursorPagination(reputationQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "reputation", direction, expression: "reputation" }
        ],
        parseCursor: (cursor) => ({ reputation: Number(cursor.reputation) })
      })

      const rows = await Promise.all(reputationRes.rows.map(async (row) => {
        const { username, player_uuid } = await bisquiteDB
          .selectFrom("CMI_users")
          .select(["username", "player_uuid"])
          .where("player_uuid", "=", row.uuid)
          .executeTakeFirstOrThrow()

        return {
          reputation: row.reputation ?? 0,
          uuid: row.uuid ?? player_uuid,
          nickname: username!
        }
      }))

      return {
        data: rows,
        meta: {
          hasNextPage: reputationRes.hasNextPage,
          hasPrevPage: reputationRes.hasPrevPage,
          startCursor: reputationRes.startCursor,
          endCursor: reputationRes.endCursor,
        }
      }
    case "playtime":
      const playtimeQuery = bisquiteDB
        .selectFrom("CMI_users")
        .select(["TotalPlayTime", "username"])

      const playtimeRes = await executeWithCursorPagination(playtimeQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "TotalPlayTime", direction, expression: "TotalPlayTime" }
        ],
        parseCursor: (cursor) => ({ TotalPlayTime: Number(cursor.TotalPlayTime) })
      })

      return {
        data: playtimeRes.rows,
        meta: {
          hasNextPage: playtimeRes.hasNextPage,
          hasPrevPage: playtimeRes.hasPrevPage,
          startCursor: playtimeRes.startCursor,
          endCursor: playtimeRes.endCursor,
        }
      }
    default:
      throw new Error(`Invalid type: ${type}`)
  }
}

export const getRatingByRoute = new Hono()
  .get("/get-rating-by", zValidator("query", getRatingBySchema), async (ctx) => {
    const { type, limit, cursor, ascending } = getRatingBySchema.parse(ctx.req.query())

    try {
      const res = await getRatingBy({ type, limit, cursor, ascending })

      ctx.header('Cache-Control', 'public, max-age=30')

      return ctx.json(res, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })