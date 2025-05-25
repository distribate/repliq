import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";

export const USERS_PER_PAGE = 6;

export const usersAtom = atom<Array<unknown> | null>(null, "usersAtom")

export const usersAction = reatomAsync(async (ctx) => {
  usersAtom(ctx, [])
}).pipe(withStatusesAtom())