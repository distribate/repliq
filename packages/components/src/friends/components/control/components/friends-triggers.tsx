"use client"

import { FriendsControlProps } from './friends-control.tsx';
import { requestsIncomingQuery } from '../../../queries/requests-incoming-query.ts';
import { friendsQuery } from '../../../queries/friends-query.ts';
import { requestsOutgoingQuery } from '../../../queries/requests-outgoing-query.ts';

export const FriendsIncomingTrigger = () => {
  const { data: incomingRequests } = requestsIncomingQuery();
  
  if (!incomingRequests
    || incomingRequests && !incomingRequests.length
  ) return null;
  
  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
			{incomingRequests.length || 0}
    </span>
  );
};

export const FriendsTrigger = ({
  nickname
}: FriendsControlProps) => {
  const { data: friends } = friendsQuery({ nickname });
  
  if (!friends
    || friends && !friends.length
  ) return null;
  
  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-emerald-500">
			{friends.length ? friends.length : 0}
		</span>
  )
}

export const FriendsOutgoingTrigger = () => {
  const { data: outgoingRequests } = requestsOutgoingQuery();
  
  if (!outgoingRequests
    || outgoingRequests && !outgoingRequests.length
  ) return null;
  
  return (
    <span className="inline-flex items-center justify-center max-h-[20px] max-w-[20px] p-2 rounded-sm overflow-hidden bg-red-500">
      {outgoingRequests.length ? outgoingRequests.length : 0}
    </span>
  );
};