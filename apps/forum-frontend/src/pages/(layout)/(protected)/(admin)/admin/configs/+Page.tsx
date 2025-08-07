import { Typography } from '@repo/ui/src/components/typography'
import { Alerts } from '#components/admin/configs/alerts/components/alerts'

export default function AdminConfigRouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Typography className="p-2" textSize="very_big">
        Конфиги
      </Typography>
      <div className="flex flex-col gap-4">
        <div className="flex h-full w-full gap-4">
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
            <Typography textSize="big">Объявления</Typography>
            <Alerts />
          </div>
          <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
            <Typography textSize="big">Рекламные объявления</Typography>
          </div>
        </div>
      </div>
    </div>
  )
}