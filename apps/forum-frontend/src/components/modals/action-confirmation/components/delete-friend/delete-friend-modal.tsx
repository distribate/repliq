import { ReactNode } from "react";
import { ConfirmationActionModalTemplate } from "#components/templates/confirmation-action-modal-template.tsx";
import { ConfirmationButton } from "#components/buttons/confirmation-action-button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { useControlFriendRequests } from "#components/friend/hooks/use-control-friend-requests.ts";
import { USER_FRIEND_DELETE_MUTATION_KEY } from "#components/friend/hooks/use-control-friend.ts";
import { FriendWithDetails } from "@repo/types/schemas/friend/friend-types.ts";
import { DynamicModal } from "#components/modals/dynamic-modal";

type DeleteFriendModal = {
  trigger: ReactNode;
} & Pick<FriendWithDetails, "friend_id" | "nickname">;

export const DeleteFriendModal = ({
  friend_id, trigger, nickname,
}: DeleteFriendModal) => {
  const { removeFriendMutation } = useControlFriendRequests();

  return (
    <DynamicModal
      mutationKey={USER_FRIEND_DELETE_MUTATION_KEY}
      trigger={trigger}
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={() => removeFriendMutation.mutate({ friend_id, recipient: nickname })}
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