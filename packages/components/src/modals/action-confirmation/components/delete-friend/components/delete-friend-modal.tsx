import { ReactNode } from 'react';
import { FriendCardProps } from '../../../../../friend/components/friend-card/friend-card.tsx';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import {
  useControlFriend,
  USER_FRIEND_DELETE_MUTATION_KEY,
} from '../../../../../friend/components/request-card/hooks/use-control-friend.ts';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';

type DeleteFriendModal = {
  trigger: ReactNode
} & Pick<FriendCardProps, 'friend_id' | 'nickname'>

export const DeleteFriendModal = ({
  friend_id, trigger, nickname,
}: DeleteFriendModal) => {
  const { removeFriendFromListMutation } = useControlFriend();
  
  const handleDeleteFriend = () => {
    return removeFriendFromListMutation.mutate({ friend_id, reqUserNickname: nickname });
  };
  
  return (
    <DynamicModal
      mutationKey={USER_FRIEND_DELETE_MUTATION_KEY}
      trigger={trigger}
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={handleDeleteFriend}
            disabled={removeFriendFromListMutation.isPending}
            pending={removeFriendFromListMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={removeFriendFromListMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};