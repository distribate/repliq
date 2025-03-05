import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx"
import { useUpdateNotifications } from "#components/notifications/hooks/use-update-notifications.ts"
import { NOTIFICATIONS_FILTER_QUERY_KEY, NotificationsFilterQuery, notificationsFilterQuery } from "#components/notifications/queries/notifications-filter-query.ts"
import { useQueryClient } from "@tanstack/react-query"

export const NotificationsNavigation = () => {
  const qc = useQueryClient()
  const { data: { type } } = notificationsFilterQuery()
  const { updateNotificationsMutation } = useUpdateNotifications()

  const handleSection = (section: "system" | "requests" | "news") => {
    qc.setQueryData(NOTIFICATIONS_FILTER_QUERY_KEY, (prev: NotificationsFilterQuery) => ({
      ...prev, type: section, cursor: undefined
    }))

    updateNotificationsMutation.mutate({ type: "update-filter" })
  }

  const isActive = (section: "system" | "requests" | "news") => section === type

  return (
    <div className="grid grid-cols-2 auto-rows-auto lg:flex lg:flex-nowrap w-full *:w-full">
      <NavigationBadge
        onClick={() => handleSection("system")}
        isActive={isActive("system")}
        title="Системные"
      />
      <NavigationBadge
        onClick={() => handleSection("requests")}
        isActive={isActive("requests")}
        title="Приглашения"
      />
      <NavigationBadge
        onClick={() => handleSection("news")}
        isActive={isActive("news")}
        title="Новости"
      />
    </div>
  )
}