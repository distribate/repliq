import { Typography } from '@repo/ui/src/components/typography'
import { Alerts } from '#components/admin/configs/alerts/components/alerts'

export default function AdminConfigRouteComponent() {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex h-full w-full gap-4">
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-lg gap-4 w-fit h-fit">
            <Typography textSize="big">Объявления</Typography>
            <Alerts />
          </div>
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-lg gap-4 w-fit h-fit">
            <Typography textSize="big">Рекламные объявления</Typography>
          </div>
        </div>
      </div>
    </div>
  )
}