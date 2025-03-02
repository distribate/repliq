import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { NotificationsList } from '#components/notifications/components/notifications-list'
import { NotificationsNavigation } from '#components/notifications/components/notifications-navigation'

export const Route = createLazyFileRoute('/_protected/notifications')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({
    meta: [
      {
        title: 'Уведомления',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full overflow-hidden max-h-dvh">
      <div className="flex flex-col items-center w-full">
        <Typography className="text-[24px] font-semibold">
          Уведомления
        </Typography>
        <Typography className="text-[16px]" textColor="gray">
          самое важное к прочтению
        </Typography>
      </div>
      <NotificationsNavigation />
      <div className="flex h-full overflow-auto w-full lg:w-4/5">
        <NotificationsList />
      </div>
    </div>
  )
}