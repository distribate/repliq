import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/admin/stats')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col p-4 rounded-[12px] w-full h-full">
      <Typography textSize="very_big">Статистика</Typography>
      ...
    </div>
  )
}
