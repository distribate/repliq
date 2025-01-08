import { DynamicModal } from "#modals/dynamic-modal.tsx";
import {
  BLOCK_USER_MUTATION_KEY,
  UNBLOCK_USER_MUTATION_KEY,
  useBlockUser,
} from "#modals/action-confirmation/components/block-user/hooks/use-block-user.ts";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Ban } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationButton } from "#buttons/confirmation-action-button.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationActionModalTemplate } from "#templates/confirmation-action-modal-template.tsx";
import { blockedUserQuery } from "../queries/blocked-user-query";

type BlockUserModalProps = {
  requestedUserNickname: string;
};

export const BlockUserModal = ({ requestedUserNickname }: BlockUserModalProps) => {
  const { data: blockedState } = blockedUserQuery(requestedUserNickname);
  const { blockUserMutation, unblockUserMutation } = useBlockUser();

  const isBlocked = blockedState?.recipient === requestedUserNickname || false;

  const handleBlockUser = () => {
    if (isBlocked) {
      return unblockUserMutation.mutate(requestedUserNickname);
    } else {
      return blockUserMutation.mutate(requestedUserNickname);
    }
  };

  return (
    <DynamicModal
      trigger={
        <HoverCardItem className="group gap-2">
          <Ban size={16} className="text-shark-300" />
          <Typography>
            {isBlocked ? `Разблокировать` : `Заблокировать`}
          </Typography>
        </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title={isBlocked ? "Удалить" : "Добавить"}
            actionType="continue"
            onClick={handleBlockUser}
            disabled={
              blockUserMutation.isPending || unblockUserMutation.isPending
            }
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={
                blockUserMutation.isPending || unblockUserMutation.isPending
              }
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
      mutationKey={
        isBlocked ? UNBLOCK_USER_MUTATION_KEY : BLOCK_USER_MUTATION_KEY
      }
    />
  );
};
