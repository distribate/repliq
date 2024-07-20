import { useTerminateSession } from '../hooks/use-terminate-session.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { TERMINATE_ALL_SESSIONS_MODAL_NAME } from '../../../../user-settings/terminate-all-sessions-modal.tsx';

export const TerminateNotActiveSessionsModal = () => {
  const { terminateMutation } = useTerminateSession();
  const { removeDialogMutation } = useDialog();
  
  const handleAllTerminate = () => {
    terminateMutation.mutate({ type: 'all' });
    removeDialogMutation.mutate(TERMINATE_ALL_SESSIONS_MODAL_NAME);
  };
  
  return (
    <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить все остальные сессии?">
      <ConfirmationButton
        actionType="continue"
        title="Да, уничтожить"
        onClick={handleAllTerminate}
        disabled={terminateMutation.isPending}
      />
      <ConfirmationButton
        actionType="cancel"
        title="Отмена"
        disabled={terminateMutation.isPending}
        onClick={() => removeDialogMutation.mutate(TERMINATE_ALL_SESSIONS_MODAL_NAME)}
      />
    </ConfirmationActionModalTemplate>
  );
};