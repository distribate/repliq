import { Typography } from '@repo/ui/src/components/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/shop')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Магазин',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full min-h-dvh items-center justify-start h-full gap-6 relative">
      <Typography className="text-[24px] font-semibold">Магазин</Typography>
      <div className="flex flex-col w-full h-full gap-6">
        <div id="banners" className="grid grid-cols-[1.2fr_0.8fr] grid-rows-1 w-full h-full gap-4">
          <div className="flex w-full h-full rounded-lg p-4 bg-primary-color">
            1
          </div>
          <div className="flex w-full h-full rounded-lg p-4 bg-primary-color">
            2
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4 rounded-lg bg-primary-color w-full h-full">
          <Typography textSize="big">
            Товары
          </Typography>
        </div>
      </div>
    </div>
  )
}
