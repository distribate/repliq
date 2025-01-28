import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@repo/components/src/admin/components/dashboard/components/dashboard'

export const Route = createLazyFileRoute('/_protected/_admin/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Typography className="p-2" textSize="very_big">
        Дашборд
      </Typography>
      <Dashboard />
    </div>
  )
}
