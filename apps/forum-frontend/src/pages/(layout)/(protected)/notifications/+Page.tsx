import { Typography } from '@repo/ui/src/components/typography'
import { NotificationsList } from '#components/notifications/components/notifications-list'
import { NotificationsNavigation } from '#components/notifications/components/notifications-navigation'

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden max-h-dvh">
      <div className="flex flex-col gap-4 h-full w-full lg:w-4/5">
        <div className="flex flex-col items-center w-full">
          <Typography className="text-[24px] font-semibold">
            Уведомления
          </Typography>
          <Typography className="text-[16px]" textColor="gray">
            самое важное к прочтению
          </Typography>
        </div>
        <NotificationsNavigation />
        <div className="flex h-full overflow-auto">
          <NotificationsList />
        </div>
      </div>
    </div>
  )
}