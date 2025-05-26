import { friendsCountAction } from "#components/friends/models/friends-count.model";
import { reatomComponent } from "@reatom/npm-react";

export const FriendsIncomingRequestsIndicator = reatomComponent(({ ctx }) => {
  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {ctx.spy(friendsCountAction.dataAtom)?.requestsCount.incoming ?? 0}
    </span>
  );
}, "FriendsIncomingRequestsIndicator")

export const FriendsAllCountIndicator = reatomComponent(({ ctx }) => {
  return (
    <span
      className="inline-flex items-center justify-center max-h-[20px] 
        max-w-[20px] p-2 rounded-sm overflow-hidden bg-emerald-500"
    >
      {ctx.spy(friendsCountAction.dataAtom)?.friendsCount ?? 0}
    </span>
  );
}, "FriendsAllCountIndicator")

export const FriendsOutgoingRequstsIndicator = reatomComponent(({ ctx }) => {
  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {ctx.spy(friendsCountAction.dataAtom)?.requestsCount.outgoing ?? 0}
    </span>
  );
}, "FriendsOutgoingRequstsIndicator")