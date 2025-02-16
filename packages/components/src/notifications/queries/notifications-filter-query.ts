import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { useQuery } from "@tanstack/react-query"

export const NOTIFICATIONS_FILTER_QUERY_KEY = createQueryKey("user", ["filter", "notifications"])

export type NotificationsFilterQuery = {
  type: "system" | "requests" | "news"
  cursor?: string
}

export const notificationsFilterQuery = () => useQuery<NotificationsFilterQuery, Error>({
  queryKey: NOTIFICATIONS_FILTER_QUERY_KEY,
  initialData: {
    type: "system"
  },
  refetchOnWindowFocus: false,
})