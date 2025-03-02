import { Typography } from '@repo/ui/src/components/typography'
import { createLazyFileRoute } from '@tanstack/react-router'
import { RatingList } from "#components/ratings/components/rating-list"
import { RatingNavigation } from "#components/ratings/components/rating-navigation"
// import { RatingFiltration } from "#components/ratings/components/rating-filtration"

export const Route = createLazyFileRoute('/_protected/ratings/')({
  component: RouteComponent,
  // @ts-ignore
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
    <div className="flex flex-col w-full items-center justify-center h-full gap-6 lg:py-6 relative">
      <Typography textSize="very_big">
        Рейтинг
      </Typography>
      <RatingNavigation />
      {/* <RatingFiltration /> */}
      <RatingList />
    </div>
  )
}