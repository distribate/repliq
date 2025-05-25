import { createLazyFileRoute } from '@tanstack/react-router'
import { RatingList } from "#components/ratings/components/rating-list"
import { RatingNavigation } from "#components/ratings/components/rating-navigation"

export const Route = createLazyFileRoute('/_protected/ratings/')({
  component: RouteComponent,
  // @ts-ignore
  head: () => ({
    meta: [
      {
        title: 'Рейтинг игроков',
        description: "Игровой рейтинг игроков"
      },
    ],
  }),
})

function RouteComponent() {
  return (
    <div className="flex flex-col w-full gap-4 items-center justify-center h-full relative">
      <RatingNavigation />
      <div className="flex w-full bg-primary-color p-2 rounded-lg h-full">
        <RatingList />
      </div>
    </div>
  )
}