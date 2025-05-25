import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { logoutAction, logoutModalIsOpenAtom } from "../models/logout.model.ts";
import { Dialog, DialogClose, DialogContent } from "@repo/ui/src/components/dialog.tsx";
import { DialogLoader } from "#components/templates/components/dialog-loader.tsx";
import { reatomComponent } from "@reatom/npm-react";

export const LogoutModal = reatomComponent(({ ctx }) => {
  return (
    <Dialog open={ctx.spy(logoutModalIsOpenAtom)} onOpenChange={v => logoutModalIsOpenAtom(ctx, v)}>
      <DialogContent>
        {ctx.spy(logoutAction.statusesAtom).isPending ? (
          <DialogLoader />
        ) : (
          <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
            <ConfirmationButton
              title="Да, выйти"
              actionType="continue"
              onClick={() => logoutAction(ctx)}
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
        )}
      </DialogContent>
    </Dialog>
  );
}, "LogoutModal")