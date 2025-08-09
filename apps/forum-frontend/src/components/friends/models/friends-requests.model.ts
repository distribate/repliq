import { atom } from "@reatom/core";
import { reatomAsync } from "@reatom/async";
import { withReset } from "@reatom/framework";
import { forumUserClient } from "#shared/forum-client";
import { logger } from "@repo/lib/utils/logger";

type FriendRequestEntity = {
  id: string,
  initiator: string,
  recipient: string,
  created_at: string,
  avatar: string | null
}

export const incomingRequestsAtom = atom<FriendRequestEntity[] | null>(null, "incomingRequests").pipe(withReset())
export const outgoingRequestsAtom = atom<FriendRequestEntity[] | null>(null, "outgoingRequests").pipe(withReset())

async function getRequestsByType(
  type: "incoming" | "outgoing",
  init?: RequestInit
): Promise<FriendRequestEntity[] | null> {
  const res = await forumUserClient.user["get-friends-requests"].$get({ query: { type } }, { init });
  const data = await res.json();
  if ("error" in data) throw new Error(data.error)

  return data.data.length ? data.data : null;
}

export const incomingRequestsAction = reatomAsync(async (ctx) => {
  const cache = ctx.get(incomingRequestsAtom)

  if (cache) {
    return cache
  }

  return await ctx.schedule(() => getRequestsByType("incoming", { signal: ctx.controller.signal }))
}, {
  name: "incomingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    incomingRequestsAtom(ctx, res)
  }
})

export const outgoingRequestsAction = reatomAsync(async (ctx) => {
  const cache = ctx.get(outgoingRequestsAtom)

  if (cache) {
    return cache
  }

  return await ctx.schedule(() => getRequestsByType("outgoing", { signal: ctx.controller.signal }))
}, {
  name: "outgoingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return
    outgoingRequestsAtom(ctx, res)
  }
})

incomingRequestsAtom.onChange((_, v) => import.meta.env.DEV && logger.info("incomingRequestsAtom", v))
outgoingRequestsAtom.onChange((_, v) => import.meta.env.DEV && logger.info("outgoingRequestsAtom", v))