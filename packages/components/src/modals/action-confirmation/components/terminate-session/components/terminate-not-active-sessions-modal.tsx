import { useTerminateSession } from '../hooks/use-terminate-session.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';

export const TerminateNotActiveSessionsModal = () => {
  const { terminateMutation } = useTerminateSession();
  const { removeDialogMutation } = useDialog();
  
  const handleAllTerminate = () => {
    terminateMutation.mutate({
      type: 'all',
    });
    
    removeDialogMutation.mutate({
      dialogName: 'terminate-all-not-active-sessions',
    });
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
        onClick={() => removeDialogMutation.mutate({
          dialogName: 'terminate-all-not-active-sessions',
        })}
      />
    </ConfirmationActionModalTemplate>
  );
};