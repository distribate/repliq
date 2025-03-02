import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRatings, GetRatings } from "./get-ratings";
import { RATING_FILTER_QUERY_KEY, RatingFilterQuery } from "./ratings-filter-query";

export const RATING_QUERY_KEY = createQueryKey("ui", ["ratings"])

export const ratingQuery = ({
  type, ascending
}: Omit<GetRatings, "cursor" | "limit">) => {
  const qc = useQueryClient();

  return useQuery({
    queryKey: RATING_QUERY_KEY,
    queryFn: async () => {
      const res = await getRatings({ type, ascending })

      if (!res) return null;

      qc.setQueryData(RATING_FILTER_QUERY_KEY, (prev: RatingFilterQuery) =>
        ({ ...prev, cursor: res.meta?.endCursor })
      )

      return res;
    },
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}