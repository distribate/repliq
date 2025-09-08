import { atom } from '@reatom/core';

export const postsAscendingAtom = atom(false, "postsAscending")
export const postsTypeAtom = atom<"created_at" | "views_count">("created_at", "postsType")
export const postsCursorAtom = atom<string | undefined>(undefined, "postsCursor")
export const postsSearchQueryAtom = atom("", "postsSearchQuery")