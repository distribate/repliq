import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { atom } from "@reatom/core";

export const blockedUserAtom = atom<{ recipient: string } | null>(null, "blockedUser")

export const blockUserAction = reatomAsync(async (ctx, recipient: string) => {

}).pipe(withStatusesAtom())

export const unblockUserAction = reatomAsync(async (ctx, recipient: string) => {

}).pipe(withStatusesAtom())