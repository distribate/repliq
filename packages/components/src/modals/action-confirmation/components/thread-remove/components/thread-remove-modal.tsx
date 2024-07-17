import { useThreadControl } from '../../../../../thread/components/thread-control/hooks/use-thread-control.ts';
import { ThreadModel } from '../../../../../thread/queries/get-thread.ts';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';

export const ThreadRemoveModal = ({
  id: thread_id,
}: Pick<ThreadModel, 'id'>) => {
  const { updateThreadFieldsMutation } = useThreadControl();
  const { removeDialogMutation } = useDialog();
  
  return (
    <ConfirmationActionModalTemplate title="Уверены, что хотите удалить тред?">
      <ConfirmationButton
        actionType="continue"
        title="Да, удалить"
        pending={updateThreadFieldsMutation.isPending}
        disabled={updateThreadFieldsMutation.isPending}
        onClick={() => {
          updateThreadFieldsMutation.mutate({
            type: 'remove', id: thread_id,
          });
          removeDialogMutation.mutate({
            dialogName: 'remove-thread'
          })
        }}
      />
      <ConfirmationButton
        actionType="cancel"
        title="Отмена"
        pending={updateThreadFieldsMutation.isPending}
        disabled={updateThreadFieldsMutation.isPending}
        onClick={() => removeDialogMutation.mutate({
          dialogName: 'remove-thread',
        })}
      />
    </ConfirmationActionModalTemplate>
  );
};