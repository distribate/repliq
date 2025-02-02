import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { NotificationsList } from '@repo/components/src/notifications/components/notifications-list'
import { NavigationBadge } from '@repo/components/src/navigation/components/navigation-badge'

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

  const handleSection = () => {

  }

  const isActive = () => {
    return false
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-4 w-full overflow-hidden max-h-dvh">
      <div className="flex flex-col items-center w-full h-full">
        <Typography className="text-[24px] font-semibold">
          Уведомления
        </Typography>
        <Typography className="text-[16px]" textColor="gray">
          самое важное к прочтению
        </Typography>
      </div>
      <div className="flex items-center gap-4 w-3/5 justify-center">
        <NavigationBadge
          onClick={handleSection}
          isActive={isActive()}
          title="Системные"
        />
        <NavigationBadge
          onClick={handleSection}
          isActive={isActive()}
          title="Приглашения"
        />
        <NavigationBadge
          onClick={handleSection}
          isActive={isActive()}
          title="Новости"
        />
      </div>
      <div className="flex h-full overflow-auto w-3/5">
        <NotificationsList />
      </div>
    </div>
  )
}