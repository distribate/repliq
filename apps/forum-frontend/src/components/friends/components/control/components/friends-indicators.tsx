import { friendsCountAction } from "#components/friends/models/friends-count.model";
import { incomingRequestsAtom, outgoingRequestsAtom } from "#components/friends/models/friends-requests.model";
import { reatomComponent } from "@reatom/npm-react";

export const FriendsIncomingRequestsIndicator = reatomComponent(({ ctx }) => {
  const incomingRequests = ctx.spy(incomingRequestsAtom)

  if (!incomingRequests || (incomingRequests && !incomingRequests.length)) return null;

  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {incomingRequests.length || 0}
    </span>
  );
}, "FriendsIncomingRequestsIndicator")

export const FriendsAllCountIndicator = reatomComponent(({ ctx }) => {
  return (
    <span
      className="inline-flex items-center justify-center max-h-[20px] 
        max-w-[20px] p-2 rounded-sm overflow-hidden bg-emerald-500"
    >
      {ctx.spy(friendsCountAction.dataAtom) ?? 0}
    </span>
  );
}, "FriendsAllCountIndicator")

export const FriendsOutgoingRequstsIndicator = reatomComponent(({ ctx }) => {
  const outgoingRequests = ctx.spy(outgoingRequestsAtom)

  if (!outgoingRequests || (outgoingRequests && !outgoingRequests.length))
    return null;

  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {outgoingRequests.length ? outgoingRequests.length : 0}
    </span>
  );
}, "FriendsOutgoingRequstsIndicator")