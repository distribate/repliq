import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { throwError } from "@repo/lib/helpers/throw-error";
import { cmiDB } from "#shared/database/cmi-db.ts";
import { executeWithCursorPagination } from "kysely-paginate";
import { playerPointsDB } from "#shared/database/playerpoints-db.ts";
import { landsDB } from "#shared/database/lands-db.ts";
import { reputationDB } from "#shared/database/reputation-db.ts";

const getRatingBySchema = z.object({
  type: z.enum(["charism", "belkoin", "lands_chunks", "reputation", "playtime"]),
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
    case "charism":
      const charismQuery = cmiDB
        .selectFrom("cmi_users")
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
      const landsQuery = landsDB
        .selectFrom("lands_lands_claims")
        .select(["land", "chunks_amount", "blocks"])

      const landsRes = await executeWithCursorPagination(landsQuery, {
        perPage: limit,
        after: cursor,
        fields: [
          { key: "chunks_amount", direction, expression: "chunks_amount" }
        ],
        parseCursor: (cursor) => ({ chunks_amount: Number(cursor.chunks_amount) })
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
        const { username, player_uuid } = await cmiDB
          .selectFrom("cmi_users")
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
      const playtimeQuery = cmiDB
        .selectFrom("cmi_users")
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

      return ctx.json(res, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500);
    }
  })