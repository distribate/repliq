import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import Events from '@repo/assets/gifs/minecraft-boime.gif'

export const Route = createLazyFileRoute('/_protected/ratings/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Рейтинги',
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
      <div className="flex flex-col items-center gap-y-4">
        <img src={Events} alt="" width={256} height={256} />
        <Typography className="text-xl font-bold text-shark-50">
          Рейтингов пока нет
        </Typography>
      </div>
    </div>
  )
}
