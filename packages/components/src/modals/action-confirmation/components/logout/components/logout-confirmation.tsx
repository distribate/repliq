import { useLogout } from '../hooks/use-logout.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';

export const LogoutConfirmation = () => {
  const { logOut } = useLogout();
  const { removeDialogMutation } = useDialog();
  
  return (
    <ConfirmationActionModalTemplate title="Уверены, что хотите выйти?">
      <ConfirmationButton
        title="Да, выйти"
        actionType="continue"
        onClick={() => logOut.mutate()}
        disabled={logOut.isPending}
        pending={logOut.isPending}
      />
      <ConfirmationButton
        title="Отмена"
        actionType="cancel"
        disabled={logOut.isPending}
        onClick={() => removeDialogMutation.mutate( 'logout-confirm')}
      />
    </ConfirmationActionModalTemplate>
  );
};