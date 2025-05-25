import { atom } from "@reatom/core"

export type CategoryThreadsFilter = {
  view: "grid" | "cols",
  sort: "created_at" | "views"
}

const initial: CategoryThreadsFilter = { view: "cols", sort: "created_at" }

export const categoryThreadFilterAtom = atom<CategoryThreadsFilter>(initial, "categoryThreadFilter")
