import { useTerminateSession } from '../hooks/use-terminate-session.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import {
  selectedSessionIdQuery,
} from '../../../../../cards/components/user-personal-card/components/account-settings/components/user-session-block.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { TERMINATE_SESSION_MODAL_NAME } from '../../../../user-settings/terminate-session-modal.tsx';

export const TerminateSessionConfirmation = () => {
  const { terminateMutation } = useTerminateSession();
  const { removeDialogMutation } = useDialog();
  const { data: selectedSessionId } = selectedSessionIdQuery();
  
  if (!selectedSessionId) return null;
  
  const handleTerminate = () => {
    terminateMutation.mutate({
      type: 'single',
      values: {
        session_id: selectedSessionId
      },
    });
    
    removeDialogMutation.mutate(TERMINATE_SESSION_MODAL_NAME);
  };
  
  return (
    <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
      <ConfirmationButton
        actionType="continue"
        title="Да, уничтожить"
        onClick={handleTerminate}
        disabled={terminateMutation.isPending}
      />
      <ConfirmationButton
        actionType="cancel"
        title="Отмена"
        disabled={terminateMutation.isPending}
        onClick={() => removeDialogMutation.mutate(TERMINATE_SESSION_MODAL_NAME)}
      />
    </ConfirmationActionModalTemplate>
  );
};