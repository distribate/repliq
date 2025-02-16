import { NavigationBadge } from "#navigation/components/navigation-badge.tsx"
import { useUpdateRating } from "#ratings/hooks/use-update-ratings.ts"
import { GetRatings } from "#ratings/queries/get-ratings.ts"
import { RATING_FILTER_QUERY_KEY, RatingFilterQuery, ratingFilterQuery } from "#ratings/queries/ratings-filter-query.ts"
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
    <div className="flex items-center justify-center gap-2 flex-wrap lg:flex-nowrap w-full">
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