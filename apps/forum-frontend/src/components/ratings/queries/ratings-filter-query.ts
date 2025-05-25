import { GetRatings } from "./get-ratings"
import { atom } from "@reatom/core"

export type RatingFilterQuery = Omit<GetRatings, "limit">

export const ratingFilterAtom = atom<RatingFilterQuery>({ type: "playtime", ascending: "false" }, "ratingFilter")