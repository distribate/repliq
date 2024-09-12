'use client';

import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { checkFriendRequestStatus } from '@repo/lib/helpers/check-friend-request-status.ts';
import { IncomingFriendButton } from './incoming-friend-button.tsx';
import { OutgoingFriendButton } from './outgoing-friend-button.tsx';
import { AddFriendButton } from './add-friend-button.tsx';
import { DeleteFriendButton } from './delete-friend-button.tsx';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { REQUESTS_QUERY_KEY } from '../../../../../../friends/queries/requests-query.ts';
import { FRIENDS_QUERY_KEY } from '../../../../../../friends/queries/friends-query.ts';

export type FriendButtonProps = {
  reqUserNickname: string
}

export const FriendButton = ({
  reqUserNickname,
}: FriendButtonProps) => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const isFetchingRq = useIsFetching({ queryKey: REQUESTS_QUERY_KEY(currentUser?.nickname) });
  const isFetchingFriends = useIsFetching({ queryKey: FRIENDS_QUERY_KEY(currentUser?.nickname) });
  const reqStatus = checkFriendRequestStatus(reqUserNickname);
  
  if (isFetchingRq) return (
    <Skeleton className="h-10 border border-white/10 rounded-md w-40" />
  );
  
  console.log(`Friend Request Status: ${reqStatus}`);
  
  if (!currentUser || !reqStatus) return null;
  
  return (!isFetchingRq && !isFetchingFriends) && (
    <>
      {reqStatus === 'friend' && (
        <DeleteFriendButton recipient={reqUserNickname} />
      )}
      {reqStatus === 'default' && (
        <AddFriendButton recipient={reqUserNickname} />
      )}
      {reqStatus === 'accept' && (
        <IncomingFriendButton initiator={reqUserNickname} />
      )}
      {reqStatus === 'deny' && (
        <OutgoingFriendButton recipient={reqUserNickname} />
      )}
    </>
  );
};