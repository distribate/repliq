import { authClient } from "#shared/auth-client";
import { atom } from "@reatom/core";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";
import { validateResponse } from "#shared/api/validation";

export type UserActiveSessionsPayload = Awaited<ReturnType<typeof getUserSessions>>;

const getUserSessions = async () => {
  const res = await authClient["get-sessions"].$get()
  return validateResponse<typeof res>(res)
}

export const currentSessionAtom = atom<UserActiveSessionsPayload[number] | null>(null, "currentSession")

export const userActiveSessionsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUserSessions())
}, "userActiveSessionsAction").pipe(withDataAtom(), withStatusesAtom(), withCache({ swr: false }))

userActiveSessionsAction.dataAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentSession = state
    ? state.find((item) => (item ? item.is_current : null))
    : null;

  if (!currentSession) return;

  currentSessionAtom(ctx, currentSession)
})