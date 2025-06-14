import type { getAlertsSchema } from "@repo/types/schemas/alerts/get-alerts-schema.ts";
import { z } from "zod/v4"
import { sqliteDB } from "#shared/database/sqlite-db.ts";

const DEFAULT_LIMIT = 1

type Alert = {
  id: number,
  link: string | null,
  creator: string,
  created_at: string | Date,
  title: string,
  description: string
}

export const getAlerts = async ({ cursor, limit = DEFAULT_LIMIT }: z.infer<typeof getAlertsSchema>) => {
  const query = await sqliteDB
    .selectFrom("alerts")
    .selectAll()
    .$castTo<Alert>()
    .limit(limit)
    .execute()

  return {
    data: query,
    meta: {
      hasNextPage: false,
      endCursor: undefined,
      startCursor: undefined,
      hasPrevPage: false
    }
  }
}