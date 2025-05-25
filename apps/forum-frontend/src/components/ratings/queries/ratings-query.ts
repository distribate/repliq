import { getRatings, GetRatings } from "./get-ratings";
import { ratingFilterAtom } from "./ratings-filter-query";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";
import { UnwrapPromise } from "@repo/lib/helpers/unwrap-promise-type";

type RatingData = UnwrapPromise<ReturnType<typeof getRatings>>["data"]
type RatingMeta = UnwrapPromise<ReturnType<typeof getRatings>>["meta"]

export const ratingDataAtom = atom<RatingData | null>(null, "ratingData")
export const ratingMetaAtom = atom<RatingMeta | null>(null, "ratingMeta")

export const ratingAction = reatomAsync(async (ctx, options: Omit<GetRatings, "cursor" | "limit">) => {
  return await ctx.schedule(() => getRatings(options))
}, {
  name: "ratingAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    ratingDataAtom(ctx, res.data)
    ratingMetaAtom(ctx, res.meta)
    ratingFilterAtom(ctx, (state) => ({ ...state, cursor: res.meta?.endCursor }))
  }
}).pipe(withStatusesAtom())