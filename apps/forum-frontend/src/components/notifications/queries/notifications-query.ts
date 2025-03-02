import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { getNotifications } from "./get-notifications"
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { NOTIFICATIONS_FILTER_QUERY_KEY, NotificationsFilterQuery } from "./notifications-filter-query"

export const NOTIFICATIONS_QUERY_KEY = createQueryKey("user", ["notifications"])

export const notificationsQuery = () => {
  const qc = useQueryClient()

  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await getNotifications({ type: "system" })

      if (!res) return null;

      qc.setQueryData(NOTIFICATIONS_FILTER_QUERY_KEY, (prev: NotificationsFilterQuery) =>
        ({ ...prev, cursor: res.meta?.endCursor })
      )

      return res;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}