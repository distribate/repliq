import { ReactNode, useState } from 'react';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import { ConfirmationActionModalTemplate } from '#templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '#buttons/confirmation-action-button.tsx';
import { LOGOUT_MUTATION_KEY, useLogout } from '../hooks/use-logout.ts';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { DialogLoader } from '#templates/dialog-loader.tsx';

type LogoutModal = {
  trigger: ReactNode
}

export const LogoutModal = ({
  trigger,
}: LogoutModal) => {
  const [ freeze, setFreeze ] = useState(true);
  const { logoutMutation } = useLogout();
  
  const handleClose = () => {
    setFreeze(false);
  };
  
  return (
    <DynamicModal
      freeze={freeze}
      mutationKey={LOGOUT_MUTATION_KEY}
      trigger={trigger}
      content={logoutMutation.isPending ? <DialogLoader /> : (
        <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
          <ConfirmationButton
            title="Да, выйти"
            actionType="continue"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          />
          <DialogClose onClick={handleClose}>
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