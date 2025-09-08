import { atom } from "@reatom/core"

export const categoryThreadsViewAtom = atom<"grid" | "cols">("cols", "categoryThreadsView")
export const categoryThreadsSortAtom = atom<"created_at" | "views_count">("created_at")