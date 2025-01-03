import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { getNotifications } from "./get-notifications"
import { useQuery } from "@tanstack/react-query"

export const NOTIFICATIONS_QUERY_KEY = createQueryKey("user", ["notifications"])

export const notificationsQuery = () => useQuery({
  queryKey: NOTIFICATIONS_QUERY_KEY,
  queryFn: () => getNotifications(),
  refetchOnWindowFocus: false,
  refetchOnMount: false
})