import { NavigationBadge } from "#components/navigation/components/navigation-badge.tsx"
import { updateRatingAction } from "#components/ratings/hooks/use-update-ratings.ts"
import { GetRatings } from "#components/ratings/queries/get-ratings.ts"
import { ratingFilterAtom, RatingFilterQuery } from "#components/ratings/queries/ratings-filter-query.ts"
import { reatomComponent } from "@reatom/npm-react"

const RATING_NAVIGATION: { title: string, type: GetRatings["type"] }[] = [
  { title: "Время игры", type: "playtime" },
  { title: "Харизма", type: "charism" },
  { title: "Белкоин", type: "belkoin" },
  { title: "Паркур", type: "parkour" },
  { title: "Регионы", type: "lands_chunks" },
  { title: "Репутация", type: "reputation" }
]

export const RatingNavigation = reatomComponent(({ ctx }) => {
  const currentType = ctx.spy(ratingFilterAtom).type

  const changeRatingType = (type: RatingFilterQuery["type"]) => {
    if (type === currentType) return

    ratingFilterAtom(ctx, (state) => ({ ...state, type }))

    updateRatingAction(ctx, "update-filter")
  }

  return (
    <div className="grid grid-cols-2 bg-shark-950 p-2 gap-2 overflow-hidden rounded-xl auto-rows-auto lg:flex lg:flex-nowrap w-full *:w-full">
      {RATING_NAVIGATION.map(rating => (
        <NavigationBadge
          key={rating.type}
          data-state={currentType === rating.type ? "active" : "inactive"}
          title={rating.title}
          onClick={() => changeRatingType(rating.type)}
        />
      ))}
    </div>
  )
}, "RatingNavigation")