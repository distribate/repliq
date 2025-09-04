import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { logoutAction, logoutModalIsOpenAtom } from "../models/logout.model.ts";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { reatomComponent } from "@reatom/npm-react";
import { spawn } from "@reatom/framework";

export const LogoutModal = reatomComponent(({ ctx }) => {  
  return (
    <Dialog open={ctx.spy(logoutModalIsOpenAtom)} onOpenChange={v => logoutModalIsOpenAtom(ctx, v)}>
      <DialogContent>
        <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
          <ConfirmationButton
            title="Да, выйти"
            actionType="continue"
            onClick={() => void spawn(ctx, async (spawnCtx) => logoutAction(spawnCtx))}
            disabled={ctx.spy(logoutAction.statusesAtom).isPending}
          />
          <DialogClose asChild>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={ctx.spy(logoutAction.statusesAtom).isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      </DialogContent>
    </Dialog>
  );
}, "LogoutModal")