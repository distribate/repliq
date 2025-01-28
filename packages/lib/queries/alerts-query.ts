import { createQueryKey } from "#helpers/query-key-builder.ts"
import { forumLandingClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"
import { getAlertsSchema } from "@repo/types/schemas/alerts/get-alerts-schema.ts";
import { z } from "zod";

type GetAlerts = z.infer<typeof getAlertsSchema> & {
  enabled?: boolean
}

async function getAlerts({
  cursor, limit
}: Omit<GetAlerts, "enabled">) {
  const res = await forumLandingClient["get-alerts"].$get({
    query: {
      cursor: cursor,
      limit: `${limit}`
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data
}

export const ALERTS_QUERY_KEY = createQueryKey("ui", ["alerts"])

export const alertsQuery = ({
  cursor, limit, enabled = true
}: GetAlerts) => useQuery({
  queryKey: ALERTS_QUERY_KEY,
  queryFn: () => getAlerts({
    cursor,
    limit
  }),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  enabled
})