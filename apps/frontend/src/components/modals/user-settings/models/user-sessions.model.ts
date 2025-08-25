import { authClient } from "#shared/auth-client";
import type { InferResponseType } from "hono/client"
import { atom } from "@reatom/core";
import { reatomAsync, withCache, withDataAtom, withStatusesAtom } from "@reatom/async";

const client = authClient["get-sessions"].$get

export type GetUserActiveSessionsResponse = InferResponseType<typeof client, 200>["data"]

const getUserSessions = async () => {
  const res = await authClient["get-sessions"].$get()
  const data = await res.json()

  if (!data || 'error' in data) return null;

  return data.data
}

export const currentSessionAtom = atom<GetUserActiveSessionsResponse[0] | null>(null, "currentSession")

export const userActiveSessionsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(() => getUserSessions())
}, "userActiveSessionsAction").pipe(withDataAtom(), withStatusesAtom(), withCache())

userActiveSessionsAction.dataAtom.onChange((ctx, state) => {
  if (!state) return;

  const currentSession = state
    ? state.find((item) => (item ? item.is_current : null))
    : null;

  if (!currentSession) return;

  currentSessionAtom(ctx, currentSession)
})