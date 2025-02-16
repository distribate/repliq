import { getRatings, GetRatingsResponse } from "#ratings/queries/get-ratings.ts"
import { RATING_FILTER_QUERY_KEY, RatingFilterQuery } from "#ratings/queries/ratings-filter-query.ts"
import { RATING_QUERY_KEY } from "#ratings/queries/ratings-query.ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type UseUpdateRating = {
  type: "update-filter" | "update-cursor"
}

export const UPDATE_RATING_MUTATION_KEY = ["update-rating"]

export const useUpdateRating = () => {
  const qc = useQueryClient()

  const updateRatingMutation = useMutation({
    mutationKey: UPDATE_RATING_MUTATION_KEY,
    mutationFn: async ({ type }: UseUpdateRating) => {
      const filtering = qc.getQueryData<RatingFilterQuery>(RATING_FILTER_QUERY_KEY)

      if (!filtering) return;

      return getRatings({ ...filtering, cursor: type === 'update-filter' ? undefined : filtering.cursor })
    },
    onSuccess: async (data, variables) => {
      if (!data) {
        const currentRating = qc.getQueryData<GetRatingsResponse>(RATING_QUERY_KEY);

        return { data: currentRating?.data, meta: currentRating?.meta };
      }

      if (variables.type === "update-filter") {
        qc.setQueryData(RATING_FILTER_QUERY_KEY, (prev: RatingFilterQuery) => ({
          ...prev, cursor: undefined,
        }));

        return qc.setQueryData(RATING_QUERY_KEY, data)
      }

      qc.setQueryData(RATING_QUERY_KEY, (prev: GetRatingsResponse) => {
        if (!prev) {
          return { data: data.data, meta: data.meta };
        }

        const d = prev.data[0]

        let newRating: Array<any> = [];

        if ("TotalPlayTime" in d) {
          newRating = data.data.filter(
            // @ts-ignore
            friend => !prev.data.some(exist => exist.username === friend.username)
          )
        }

        if ("player" in d) {
          newRating = data.data.filter(
            // @ts-ignore
            friend => !prev.data.some(exist => exist.player === friend.player)
          )
        }

        if ("Balance" in d) {
          newRating = data.data.filter(
            // @ts-ignore
            friend => !prev.data.some(exist => exist.username === friend.username)
          )
        }

        if ("points" in d) {
          newRating = data.data.filter(
            // @ts-ignore
            friend => !prev.data.some(exist => exist.username === friend.username)
          )
        }

        if ("reputation" in d) {
          newRating = data.data.filter(
            // @ts-ignore
            friend => !prev.data.some(exist => exist.nickname === friend.nickname)
          )
        }

        return { data: [...prev.data, ...newRating], meta: data.meta };
      });
    },
    onError: e => { throw new Error(e.message) }
  })

  return { updateRatingMutation }
}