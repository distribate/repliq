import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx"
import { useUpdateNotifications } from "#components/notifications/hooks/use-update-notifications.ts"
import { NOTIFICATIONS_FILTER_QUERY_KEY, NotificationsFilterQuery, notificationsFilterQuery } from "#components/notifications/queries/notifications-filter-query.ts"
import { useQueryClient } from "@tanstack/react-query"

type NotificationsSections = "system" | "requests" | "news"

export const NotificationsNavigation = () => {
  const qc = useQueryClient()
  const { data: { type } } = notificationsFilterQuery()
  const { updateNotificationsMutation } = useUpdateNotifications()

  const handleSection = (section: NotificationsSections) => {
    qc.setQueryData(NOTIFICATIONS_FILTER_QUERY_KEY, (prev: NotificationsFilterQuery) => ({
      ...prev, type: section, cursor: undefined
    }))

    updateNotificationsMutation.mutate({ type: "update-filter" })
  }

  const isActive = (input: NotificationsSections) => input === type ? "active" : "inactive"

  return (
    <div className="grid grid-cols-2 auto-rows-auto lg:flex p-2 rounded-xl gap-2 bg-shark-950 overflow-hidden lg:flex-nowrap w-full *:w-full">
      <NavigationBadge onClick={() => handleSection("system")} data-state={isActive("system")} title="Системные" />
      <NavigationBadge onClick={() => handleSection("requests")} data-state={isActive("requests")} title="Приглашения" />
      <NavigationBadge onClick={() => handleSection("news")} data-state={isActive("news")} title="Новости" />
    </div>
  )
}