import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx"
import { useUpdateRating } from "#components/ratings/hooks/use-update-ratings.ts"
import { GetRatings } from "#components/ratings/queries/get-ratings.ts"
import { RATING_FILTER_QUERY_KEY, RatingFilterQuery, ratingFilterQuery } from "#components/ratings/queries/ratings-filter-query.ts"
import { useQueryClient } from "@tanstack/react-query"

const RATING_NAVIGATION: { title: string, type: GetRatings["type"] }[] = [
  { title: "Время игры", type: "playtime" },
  { title: "Харизма", type: "charism" },
  { title: "Белкоин", type: "belkoin" },
  { title: "Паркур", type: "parkour" },
  { title: "Регионы", type: "lands_chunks" },
  { title: "Репутация", type: "reputation" }
]

export const RatingNavigation = () => {
  const { data: { type: currentType } } = ratingFilterQuery()
  const { updateRatingMutation } = useUpdateRating()
  const qc = useQueryClient()

  const changeRatingType = (type: RatingFilterQuery["type"]) => {
    if (type === currentType) return

    qc.setQueryData(RATING_FILTER_QUERY_KEY, (prev: RatingFilterQuery) => ({
      ...prev, type
    }))

    updateRatingMutation.mutate({ type: "update-filter" })
  }

  return (
    <div className="grid grid-cols-2 auto-rows-auto lg:flex lg:flex-nowrap w-full *:w-full">
      {RATING_NAVIGATION.map(rating => (
        <NavigationBadge
          key={rating.type}
          isActive={currentType === rating.type}
          title={rating.title}
          onClick={() => changeRatingType(rating.type)}
        />
      ))}
    </div>
  )
}