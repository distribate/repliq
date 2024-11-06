'use client';

import { checkFriendRequestStatus, RequestStatus } from '@repo/lib/helpers/check-friend-request-status.ts';
import { IncomingFriendButton } from './incoming-friend-button.tsx';
import { OutgoingFriendButton } from './outgoing-friend-button.tsx';
import { AddFriendButton } from './add-friend-button.tsx';
import { DeleteFriendButton } from './delete-friend-button.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { useEffect, useState } from 'react';

export type FriendButtonProps = {
  reqUserNickname: string
}

export const FriendButton = ({
  reqUserNickname
}: FriendButtonProps) => {
  const [ currentRequestStatus, setCurrentRequestStatus ] = useState<RequestStatus | null>(null);
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const reqStatus = checkFriendRequestStatus(reqUserNickname);
  
  useEffect(() => {
    setCurrentRequestStatus(reqStatus);
  }, [ reqStatus ]);
  
  if (!currentRequestStatus) {
    return <Skeleton className="h-10 border border-white/10 rounded-md w-56" />;
  }
  
  return (
    <>
      {currentRequestStatus === 'friend' && (
        <DeleteFriendButton recipient={reqUserNickname} />
      )}
      {currentRequestStatus === 'default' && (
        <AddFriendButton recipient={reqUserNickname} />
      )}
      {currentRequestStatus === 'accept' && (
        <IncomingFriendButton initiator={reqUserNickname} />
      )}
      {currentRequestStatus === 'deny' && (
        <OutgoingFriendButton recipient={reqUserNickname} />
      )}
    </>
  );
};