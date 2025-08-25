import { friendsCountAction } from "#components/friends/models/friends-count.model";
import { reatomComponent } from "@reatom/npm-react";

export const FriendsIncomingRequestsIndicator = reatomComponent(({ ctx }) => {
  return (
    <span className="text-md font-semibold text-shark-400">
      {ctx.spy(friendsCountAction.dataAtom)?.requestsCount.incoming ?? 0}
    </span>
  );
}, "FriendsIncomingRequestsIndicator")

export const FriendsAllCountIndicator = reatomComponent(({ ctx }) => {
  return (
    <span
      className="text-md font-semibold text-shark-400"
    >
      {ctx.spy(friendsCountAction.dataAtom)?.friendsCount ?? 0}
    </span>
  );
}, "FriendsAllCountIndicator")

export const FriendsOutgoingRequstsIndicator = reatomComponent(({ ctx }) => {
  return (
    <span className="text-md font-semibold text-shark-400">
      {ctx.spy(friendsCountAction.dataAtom)?.requestsCount.outgoing ?? 0}
    </span>
  );
}, "FriendsOutgoingRequstsIndicator")