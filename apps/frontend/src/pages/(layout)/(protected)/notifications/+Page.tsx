import { Typography } from '@repo/ui/src/components/typography'
import { Notifications } from '#components/notifications/components/notifications-list'
import { NotificationsNavigation } from '#components/notifications/components/notifications-navigation'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center bg-primary-color rounded-xl p-2 sm:p-4 w-full min-h-dvh">
      <div className="flex flex-col items-start gap-4 h-full w-full">
        <Typography className="page-title">
          Уведомления
        </Typography>
        <NotificationsNavigation />
        <Notifications />
      </div>
    </div>
  )
}