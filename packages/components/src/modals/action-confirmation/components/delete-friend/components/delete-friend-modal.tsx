import { ReactNode } from "react";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { DynamicModal } from "../../../../dynamic-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { useControlFriendRequests } from "#friend/components/friend-card/hooks/use-control-friend-requests.ts";
import { USER_FRIEND_DELETE_MUTATION_KEY } from "#friend/components/friend-card/hooks/use-control-friend.ts";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";

type DeleteFriendModal = {
  trigger: ReactNode;
} & Pick<FriendWithDetails, "friend_id" | "nickname">;

export const DeleteFriendModal = ({
  friend_id,
  trigger,
  nickname,
}: DeleteFriendModal) => {
  const { removeFriendMutation } = useControlFriendRequests();

  const handleDeleteFriend = () => {
    return removeFriendMutation.mutate({
      friend_id,
      recipient: nickname
    });
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
            disabled={removeFriendMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={removeFriendMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};
