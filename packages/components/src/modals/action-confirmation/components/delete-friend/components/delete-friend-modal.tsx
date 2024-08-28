import { ReactNode } from 'react';
import { FriendCardProps } from '../../../../../friend/components/friend-card/friend-card.tsx';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { DeleteFriendConfirmation } from './delete-friend-confirmation.tsx';

type DeleteFriendModal = {
  trigger: ReactNode
} & Pick<FriendCardProps, 'friend_id' | "nickname">

export const DELETE_FRIEND_MODAL_NAME = "delete-friend"

export const DeleteFriendModal = ({
  friend_id, trigger, nickname
}: DeleteFriendModal) => {
  return (
    <DialogWrapper
      name={DELETE_FRIEND_MODAL_NAME}
      trigger={trigger}
    >
      <DeleteFriendConfirmation friend_id={friend_id} nickname={nickname} />
    </DialogWrapper>
  );
};