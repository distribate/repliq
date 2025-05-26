import { authClient } from "@repo/shared/api/auth-client";
import type { InferResponseType } from "hono/client"
import { atom } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";

const client = authClient["get-sessions"].$get

export type GetUserActiveSessionsResponse = InferResponseType<typeof client, 200>["data"]

const getUserSessions = async () => {
  const res = await authClient["get-sessions"].$get()
  const data = await res.json()

  if (!data || 'error' in data) return null;

  return data.data
}

export const userActiveSessionsAtom = atom<GetUserActiveSessionsResponse | null>(null, "userActiveSessions")

export const userActiveSessionsAction = reatomAsync(async (ctx) => {
  if (ctx.get(userActiveSessionsAtom)) return ctx.get(userActiveSessionsAtom)
    
  return await ctx.schedule(() => getUserSessions())
}, {
  name: "userActiveSessionsAction",
  onFulfill: (ctx, res) => {
    userActiveSessionsAtom(ctx, res)
  }
}).pipe(withStatusesAtom())