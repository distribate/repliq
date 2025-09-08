import { atom } from "@reatom/core";

export const profileThreadsViewAtom = atom<"grid" | "list">("list", "profileThreadsView")
export const profileThreadsSearchQueryAtom = atom("", "profileThreadsSearchQuery")