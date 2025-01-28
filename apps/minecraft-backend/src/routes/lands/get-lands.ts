import { landsDB } from "#shared/database/lands-db.ts";
import { throwError } from "@repo/lib/helpers/throw-error";
import { Hono } from "hono";
import { executeWithCursorPagination } from "kysely-paginate";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

type GetLands = {
  cursor?: string
}

async function getLands({
  cursor
}: GetLands) {
  const query = landsDB
    .selectFrom("lands_lands")
    .selectAll()
    .orderBy("created_at", "desc")

  const result = await executeWithCursorPagination(query, {
    perPage: 16,
    after: cursor,
    fields: [
      {
        key: "created_at",
        direction: "desc",
        expression: "created_at",
      }
    ],
    parseCursor: (cursor) => {
      return {
        created_at: new Date(cursor.created_at),
      }
    },
  })
 
  const lands = result.rows.map(land => {
    return {
      ...land,
      members: JSON.parse(land.members),
      area: JSON.parse(land.area),
    }
  })
  
  return { data: lands, ...result }
}

const getLandsSchema = z.object({
  cursor: z.string().optional()
})

export const getLandsRoute = new Hono()
  .get("/get-lands", zValidator("query", getLandsSchema), async (ctx) => {
    const { cursor } = getLandsSchema.parse(ctx.req.query())

    try {
      const lands = await getLands({
        cursor
      })

      return ctx.json(lands, 200)
    } catch (e) {
      return ctx.json({ error: throwError(e) }, 500)
    }
  })