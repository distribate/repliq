import { atom } from "@reatom/core";
import { reatomAsync, withStatusesAtom } from "@reatom/async";
import { withReset } from "@reatom/framework";
import { friendClient } from "#shared/api/forum-client";
import { log } from "#shared/utils/log";
import { validateResponse } from "#shared/api/validation";

export type FriendRequestPayload = Awaited<ReturnType<typeof getRequestsByType>>;

export type FriendRequestPayloadData = FriendRequestPayload["data"]
export type FriendRequestPayloadMeta = FriendRequestPayload["meta"]

export const incomingRequestsAtom = atom<FriendRequestPayloadData | null>(null, "incomingRequests").pipe(withReset())
export const outgoingRequestsAtom = atom<FriendRequestPayloadData | null>(null, "outgoingRequests").pipe(withReset())

async function getRequestsByType(
  type: "incoming" | "outgoing",
  init?: RequestInit
) {
  const res = await friendClient.friend["friends-requests"].$get({ query: { type } }, { init });
  return validateResponse<typeof res>(res)
}

export const incomingRequestsAction = reatomAsync(async (ctx) => {
  const cache = {
    data: ctx.get(incomingRequestsAtom)
  }

  if (cache.data) return cache

  return await ctx.schedule(() => getRequestsByType("incoming", { signal: ctx.controller.signal }))
}, {
  name: "incomingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    incomingRequestsAtom(ctx, res.data)
  },
   onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  },
}).pipe(withStatusesAtom())

export const outgoingRequestsAction = reatomAsync(async (ctx) => {
  const cache = {
    data: ctx.get(outgoingRequestsAtom)
  }

  if (cache.data) return cache
  
  return await ctx.schedule(() => getRequestsByType("outgoing", { signal: ctx.controller.signal }))
}, {
  name: "outgoingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    
    outgoingRequestsAtom(ctx, res.data)
  }
}).pipe(withStatusesAtom())

incomingRequestsAtom.onChange((_, v) => log("incomingRequestsAtom", v))
outgoingRequestsAtom.onChange((_, v) => log("outgoingRequestsAtom", v))