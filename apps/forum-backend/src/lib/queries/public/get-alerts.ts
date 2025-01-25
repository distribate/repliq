import type { getAlertsSchema } from "@repo/types/schemas/alerts/get-alerts-schema.ts";
import { forumDB } from "#shared/database/forum-db.ts"
import { executeWithCursorPagination } from "kysely-paginate"
import { z } from "zod"

export const getAlerts = async ({
  cursor, limit
}: z.infer<typeof getAlertsSchema>) => {
  const query = forumDB
    .selectFrom("config_alerts")
    .selectAll()
    .$castTo<{ id: number, link: string | null, creator: string, created_at: string | Date, title: string, description: string }>()
    .limit(limit ?? 1)

  const res = await executeWithCursorPagination(query, {
    perPage: limit ?? 1,
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

  return {
    data: res.rows,
    meta: {
      hasNextPage: res.hasNextPage,
      endCursor: res.endCursor,
      startCursor: res.startCursor,
      hasPrevPage: res.hasPrevPage
    }
  }
}