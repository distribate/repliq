import { NavigationBadge } from "#components/shared/navigation/components/navigation-badge"
import { notificationsFilterAtom, NotificationsFilterQuery } from "#components/notifications/models/notifications.model"
import { reatomComponent } from "@reatom/npm-react"
import { updateNotificationsAction } from "../models/notifications.model"

type NotificationsSections = "system" | "requests" | "news"

export const NotificationsNavigation = reatomComponent(({ ctx }) => {
  const { type } = ctx.spy(notificationsFilterAtom)

  const handleSection = (section: NotificationsSections) => {
    notificationsFilterAtom(ctx, (state: NotificationsFilterQuery) => ({
      ...state, type: section, cursor: undefined
    }))

    updateNotificationsAction(ctx, { type: "update-filter" })
  }

  const isActive = (input: NotificationsSections) => input === type ? "active" : "inactive"

  return (
    <div className="grid grid-cols-2 auto-rows-auto lg:flex p-2 rounded-xl gap-2 bg-shark-950 overflow-hidden lg:flex-nowrap w-full *:w-full">
      <NavigationBadge onClick={() => handleSection("system")} data-state={isActive("system")} title="Системные" />
      <NavigationBadge onClick={() => handleSection("requests")} data-state={isActive("requests")} title="Приглашения" />
      <NavigationBadge onClick={() => handleSection("news")} data-state={isActive("news")} title="Новости" />
    </div>
  )
}, "NotificationsNavigation")