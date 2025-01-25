import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { NotificationsList } from '@repo/components/src/notifications/components/notifications-list'

export const Route = createLazyFileRoute('/_protected/notifications')({
  component: RouteComponent,
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
    <div className="flex flex-col items-center justify-center p-6 gap-4 w-full h-full">
      <div className="flex flex-col items-center w-full">
        <Typography className="text-[24px] font-semibold">
          Уведомления
        </Typography>
        <Typography className="text-[16px]" textColor="gray">
          самое важное к прочтению
        </Typography>
      </div>
      <div className="flex h-full overflow-hidden w-3/5">
        <NotificationsList />
      </div>
    </div>
  )
}
