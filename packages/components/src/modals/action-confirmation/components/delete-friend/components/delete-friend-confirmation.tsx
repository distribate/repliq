import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { useControlFriend } from '../../../../../friend/components/request-card/hooks/use-control-friend.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { FriendCardProps } from '../../../../../friend/components/friend-card/friend-card.tsx';
import { DELETE_FRIEND_MODAL_NAME } from './delete-friend-modal.tsx';

export const DeleteFriendConfirmation = ({
  friend_id, nickname
}: Pick<FriendCardProps, "friend_id" | "nickname">) => {
  const { removeDialogMutation } = useDialog()
  const { removeFriendFromListMutation } = useControlFriend();
  
  const handleDeleteFriend = () => {
    removeFriendFromListMutation.mutate({ friend_id, reqUserNickname: nickname });
  };
  
  return (
    <ConfirmationActionModalTemplate title="Подтверждение действия">
      <ConfirmationButton
        title="Удалить"
        actionType="continue"
        onClick={handleDeleteFriend}
        disabled={removeFriendFromListMutation.isPending}
        pending={removeFriendFromListMutation.isPending}
      />
      <ConfirmationButton
        title="Отмена"
        actionType="cancel"
        disabled={removeFriendFromListMutation.isPending}
        onClick={() => removeDialogMutation.mutate(DELETE_FRIEND_MODAL_NAME)}
      />
    </ConfirmationActionModalTemplate>
  )
}