import { Typography } from '@repo/ui/src/components/typography'
import { NotificationsList } from '#components/notifications/components/notifications-list'
import { NotificationsNavigation } from '#components/notifications/components/notifications-navigation'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-dvh">
      <div className="flex flex-col items-start gap-4 h-full w-full">
        <Typography className="text-3xl font-bold">
          Уведомления
        </Typography>
        <NotificationsNavigation />
        <NotificationsList />
      </div>
    </div>
  )
}