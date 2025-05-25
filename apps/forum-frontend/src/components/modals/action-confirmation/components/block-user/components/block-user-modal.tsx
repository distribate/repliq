
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { Ban } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal";
import { blockedUserAtom, blockUserAction, unblockUserAction } from "../models/blocked-user.model";
import { reatomComponent, useAtom } from "@reatom/npm-react";

export const BlockUserModal = reatomComponent<{ recipient: string; }>(({ ctx, recipient }) => {
  const [blocked] = useAtom(blockedUserAtom)

  if (!blocked) return null;

  const isBlocked = blocked.recipient === recipient || false;

  const handleBlockUser = () => {
    if (isBlocked) {
      return blockUserAction(ctx, recipient);
    } else {
      return unblockUserAction(ctx, recipient)
    }
  };

  const isPending = ctx.spy(blockUserAction.statusesAtom).isPending || ctx.spy(unblockUserAction.statusesAtom).isPending

  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem className="group gap-2">
          <Ban size={16} className="text-shark-300" />
          <Typography>
            {isBlocked ? `Разблокировать` : `Заблокировать`}
          </Typography>
        </HoverCardItem>
      </DialogTrigger>
      <DialogContent>
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title={isBlocked ? "Удалить" : "Добавить"}
            actionType="continue"
            onClick={handleBlockUser}
            disabled={isPending}
          />
          <DialogClose>
            <ConfirmationButton title="Отмена" actionType="cancel" disabled={isPending} />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  );
}, "BlockUserModal")