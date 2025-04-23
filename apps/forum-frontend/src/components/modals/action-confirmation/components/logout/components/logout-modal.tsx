import { ReactNode } from "react";
import { DynamicModal } from "../../../../dynamic-modal/components/dynamic-modal.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { LOGOUT_MUTATION_KEY, useLogout } from "../hooks/use-logout.ts";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DialogLoader } from "#components/templates/components/dialog-loader.tsx";

type LogoutModal = {
  trigger: ReactNode;
};

export const LogoutModal = ({ trigger }: LogoutModal) => {
  const { logoutMutation } = useLogout();

  return (
    <DynamicModal
      mutationKey={LOGOUT_MUTATION_KEY}
      trigger={trigger}
      content={
        logoutMutation.isPending ? (
          <DialogLoader />
        ) : (
          <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
            <ConfirmationButton
              title="Да, выйти"
              actionType="continue"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            />
            <DialogClose>
              <ConfirmationButton
                title="Отмена"
                actionType="cancel"
                disabled={logoutMutation.isPending}
              />
            </DialogClose>
          </ConfirmationActionModalTemplate>
        )
      }
    />
  );
};
