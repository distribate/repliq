import { Typography } from '@repo/ui/src/components/typography'
import { AdminAlerts } from '#components/admin/configs/alerts/components/list/admin-alerts'
import { ContentNotFound } from '#components/templates/components/content-not-found'

export default function Page() {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex h-full w-full gap-4">
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-lg gap-4 w-fit h-fit">
            <Typography textSize="big">Объявления</Typography>
            <AdminAlerts />
          </div>
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-lg gap-4 w-fit h-fit">
            <Typography textSize="big">Рекламные объявления</Typography>
            <ContentNotFound title="Объявлений нет" />
          </div>
        </div>
      </div>
    </div>
  )
}