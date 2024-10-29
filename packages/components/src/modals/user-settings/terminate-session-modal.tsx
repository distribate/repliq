import { X } from 'lucide-react';
import {
  selectedSessionIdQuery,
  UserSessionBlockProps,
  useSelectSessionId,
} from '../../cards/components/user-personal-card/components/account-settings/components/user-session-block.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';
import { ConfirmationActionModalTemplate } from '../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../buttons/confirmation-action-button.tsx';
import {
  TERMINATE_SESSIONS_MUTATION_KEY, useTerminateSession,
} from '../action-confirmation/components/terminate-session/hooks/use-terminate-session.ts';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';

type TerminateSessionModal = Pick<UserSessionBlockProps, "id">

export const TerminateSessionModal = ({
  id
}: TerminateSessionModal) => {
  const { setValueMutation } = useSelectSessionId()
  const { terminateMutation } = useTerminateSession();
  const { data: selectedSessionId } = selectedSessionIdQuery();
  
  if (!selectedSessionId) return null;
  
  const handleTerminate = () => {
    terminateMutation.mutate({
      type: 'single',
      values: {
        session_id: selectedSessionId
      },
    });
  };
  
  if (!id) return;
  
  return (
    <DynamicModal
      mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
      trigger={
        <div onClick={() => setValueMutation.mutate(id)} className="cursor-pointer">
          <X className="h-4 w-4 text-shark-200 hover:text-shark-50" />
        </div>
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить эту сессию?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={handleTerminate}
            disabled={terminateMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              actionType="cancel"
              title="Отмена"
              disabled={terminateMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  )
}