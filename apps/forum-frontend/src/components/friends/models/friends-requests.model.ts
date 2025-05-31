import { atom } from "@reatom/core";
import { reatomAsync } from "@reatom/async";
import { FriendRequestEntity } from "@repo/types/entities/entities-type";
import { withReset } from "@reatom/framework";
import { forumUserClient } from "@repo/shared/api/forum-client";
import { logger } from "@repo/lib/utils/logger";

export const incomingRequestsAtom = atom<FriendRequestEntity[] | null>(null, "incomingRequests").pipe(withReset())
export const outgoingRequestsAtom = atom<FriendRequestEntity[] | null>(null, "outgoingRequests")

incomingRequestsAtom.onChange((_, value) => logger.info("incomingRequestsAtom", value))
outgoingRequestsAtom.onChange((_, value) => logger.info("outgoingRequestsAtom", value))

async function getRequestsByType(type: "incoming" | "outgoing"): Promise<FriendRequestEntity[] | null> {
  const res = await forumUserClient.user["get-friends-requests"].$get({ query: { type } });
  const data = await res.json();

  if (!data || "error" in data) return null;

  return data.data.length ? data.data : null;
}

export const incomingRequestsAction = reatomAsync(async (ctx) => {
  if (ctx.get(incomingRequestsAtom)) return ctx.get(incomingRequestsAtom)
  return await ctx.schedule(() => getRequestsByType("incoming"))
}, {
  name: "incomingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;
    incomingRequestsAtom(ctx, res)
  }
})

export const outgoingRequestsAction = reatomAsync(async (ctx) => {
  if (ctx.get(outgoingRequestsAtom)) return ctx.get(outgoingRequestsAtom)
  return await ctx.schedule(() => getRequestsByType("outgoing"))
}, {
  name: "outgoingRequestsAction",
  onFulfill: (ctx, res) => {
    if (!res) return
    outgoingRequestsAtom(ctx, res)
  }
})