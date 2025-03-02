import { friendsCountQuery } from "#components/friends/queries/friends-count-query.ts";
import { requestsIncomingQuery } from "#components/friends/queries/requests-incoming-query.ts";
import { requestsOutgoingQuery } from "#components/friends/queries/requests-outgoing-query.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";

export const FriendsIncomingRequestsIndicator = () => {
  const { data: incomingRequests } = requestsIncomingQuery();

  if (!incomingRequests || (incomingRequests && !incomingRequests.length))
    return null;

  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {incomingRequests.length || 0}
    </span>
  );
};

export const FriendsAllCountIndicator = () => {
  const { nickname } = getUser()
  const { data: friendsCount } = friendsCountQuery(nickname);

  if (!friendsCount) return null;

  return (
    <span
      className="inline-flex items-center justify-center max-h-[20px] 
        max-w-[20px] p-2 rounded-sm overflow-hidden bg-emerald-500"
    >
      {friendsCount}
    </span>
  );
};

export const FriendsOutgoingRequstsIndicator = () => {
  const { data: outgoingRequests } = requestsOutgoingQuery();

  if (!outgoingRequests || (outgoingRequests && !outgoingRequests.length))
    return null;

  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {outgoingRequests.length ? outgoingRequests.length : 0}
    </span>
  );
};
