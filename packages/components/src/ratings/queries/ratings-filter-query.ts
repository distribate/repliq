import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { useQuery } from "@tanstack/react-query"
import { GetRatings } from "./get-ratings"

export type RatingFilterQuery = Omit<GetRatings, "limit">

export const RATING_FILTER_QUERY_KEY = createQueryKey("ui", ["rating-filter"])

export const ratingFilterQuery = () => useQuery<RatingFilterQuery, Error>({
  queryKey: RATING_FILTER_QUERY_KEY,
  initialData: { type: "playtime", ascending: 'false' }
})