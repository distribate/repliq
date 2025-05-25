import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_protected/_admin/admin/stats')({
  component: () => {
    <div className="flex flex-col p-4 rounded-[12px] w-full h-full">
      <Typography textSize="very_big">Статистика</Typography>
      ...
    </div>
  },
})