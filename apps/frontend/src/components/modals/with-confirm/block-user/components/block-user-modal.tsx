import { ConfirmationButton } from "#shared/components/confirmation-action-button";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { ConfirmationActionModalTemplate } from "#shared/components/confirmation-action-modal";
import { blockedUserAction, blockedUserDialogIsOpenAtom, controlBlockUserAction } from "../models/blocked-user.model";
import { reatomComponent } from "@reatom/npm-react";

export const BlockUserModal = reatomComponent<{ recipient: string; }>(({ ctx, recipient }) => {
  const isBlocked = ctx.spy(blockedUserAction.dataAtom)
  const isDisabled = ctx.spy(controlBlockUserAction.statusesAtom).isPending

  const handle = () => controlBlockUserAction(ctx, recipient)

  return (
    <Dialog
      open={ctx.spy(blockedUserDialogIsOpenAtom)}
      onOpenChange={value => blockedUserDialogIsOpenAtom(ctx, value)}
    >
      <DialogContent>
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title={isBlocked ? "Разблокировать" : "Заблокировать"}
            actionType="continue"
            disabled={isDisabled}
            onClick={handle}
          />
          <DialogClose asChild>
            <ConfirmationButton title="Отмена" actionType="cancel" disabled={isDisabled} />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  );
}, "BlockUserModal")