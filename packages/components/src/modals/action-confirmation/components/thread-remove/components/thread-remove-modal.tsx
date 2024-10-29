import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadModel } from '../../../../../thread/queries/get-thread-model.ts';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import {
  THREAD_CONTROL_MUTATION_KEY,
  useThreadControl,
} from '../../../../../thread/components/thread-control/hooks/use-thread-control.ts';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';

export const ThreadRemoveModal = ({
  id,
}: Pick<ThreadModel, 'id'>) => {
  const { updateThreadFieldsMutation } = useThreadControl();
  
  return (
    <div className="flex items-center justify-end w-full">
      <DynamicModal
        mutationKey={THREAD_CONTROL_MUTATION_KEY}
        trigger={
          <Button variant="negative">
            <Typography>Удалить тред</Typography>
          </Button>
        }
        content={
          <ConfirmationActionModalTemplate title="Уверены, что хотите удалить тред?">
            <ConfirmationButton
              actionType="continue"
              title="Да, удалить"
              pending={updateThreadFieldsMutation.isPending}
              disabled={updateThreadFieldsMutation.isPending}
              onClick={() => {
                updateThreadFieldsMutation.mutate({
                  type: 'remove', id,
                });
              }}
            />
            <DialogClose>
              <ConfirmationButton
                actionType="cancel"
                title="Отмена"
                pending={updateThreadFieldsMutation.isPending}
                disabled={updateThreadFieldsMutation.isPending}
              />
            </DialogClose>
          </ConfirmationActionModalTemplate>
        }
      />
    </div>
  );
};