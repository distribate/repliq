
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Ban } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal";
import { blockedUserQuery } from "../queries/blocked-user-query";
import { BLOCK_USER_MUTATION_KEY, UNBLOCK_USER_MUTATION_KEY, useBlockUser } from "../hooks/use-block-user";
import { DynamicModal } from "#components/modals/dynamic-modal/components/dynamic-modal";

type BlockUserModalProps = {
  recipient: string;
};

export const BlockUserModal = ({ recipient }: BlockUserModalProps) => {
  const { data: blocked } = blockedUserQuery(recipient);
  const { blockUserMutation, unblockUserMutation } = useBlockUser();

  if (!blocked) return null;

  const isBlocked = blocked.recipient === recipient || false;

  const handleBlockUser = () => {
    if (isBlocked) {
      return unblockUserMutation.mutate(recipient);
    } else {
      return blockUserMutation.mutate(recipient);
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
