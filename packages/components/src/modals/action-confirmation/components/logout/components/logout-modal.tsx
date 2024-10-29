import { ReactNode } from 'react';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { LOGOUT_MUTATION_KEY, useLogout } from '../hooks/use-logout.ts';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { DialogLoader } from '../../../../../templates/dialog-loader.tsx';

type LogoutModal = {
  trigger: ReactNode
}

export const LogoutModal = ({
  trigger,
}: LogoutModal) => {
  const { logOutMutation } = useLogout();
  
  return (
    <DynamicModal
      mutationKey={LOGOUT_MUTATION_KEY}
      trigger={trigger}
      content={
        logOutMutation.isPending ? <DialogLoader /> : (
          <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
            <ConfirmationButton
              title="Да, выйти"
              actionType="continue"
              onClick={() => logOutMutation.mutate()}
              disabled={logOutMutation.isPending}
              pending={logOutMutation.isPending}
            />
            <DialogClose>
              <ConfirmationButton
                title="Отмена"
                actionType="cancel"
                disabled={logOutMutation.isPending}
              />
            </DialogClose>
          </ConfirmationActionModalTemplate>
        )
      }
    />
  );
};