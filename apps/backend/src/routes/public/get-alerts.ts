import { throwError } from "#utils/throw-error.ts";
import { Hono } from "hono";
import { sqliteDB } from "#shared/database/sqlite-db.ts";
import z from "zod";
import { zValidator } from "@hono/zod-validator";
import { executeWithCursorPagination } from "kysely-paginate";

const getAlertRouteSchema = z.object({
  cursor: z.string().optional(),
  limit: z.string().transform(Number).optional(),
  ascending: z.enum(["true", "false"]).transform((value) => value === "true"),
})

const DEFAULT_ALERTS_LIMIT = 6

type Opts = z.infer<typeof getAlertRouteSchema>

const getAlerts = async ({
  limit = DEFAULT_ALERTS_LIMIT, cursor, ascending 
}: Opts) => {
  const direction = ascending ? "asc" : "desc";

  const query = sqliteDB
    .selectFrom("alerts")
    .select([
      "alerts.id",
      "alerts.created_at",
      "alerts.title",
      "alerts.description",
      "alerts.creator",
    ])

  const res = await executeWithCursorPagination(query, {
    after: cursor,
    perPage: limit,
    fields: [
      {
        key: "created_at",
        expression: "alerts.created_at",
        direction
      }
    ],
    parseCursor: (cursor) => ({
      created_at: cursor.created_at
    })
  })

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage ?? false,
      hasPrevPage: res.hasPrevPage ?? false,
      startCursor: res.startCursor,
      endCursor: res.endCursor
    }
  }
}

export const getAlertRoute = new Hono()
  .get("/alerts", zValidator("query", getAlertRouteSchema), async (ctx) => {
    const result = getAlertRouteSchema.parse(ctx.req.query());

    try {
      const data = await getAlerts(result)

      return ctx.json({ data }, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })