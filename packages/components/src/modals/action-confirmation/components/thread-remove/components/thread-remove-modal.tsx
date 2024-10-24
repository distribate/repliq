import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { ThreadRemoveConfirmation } from './thread-remove-confirmation.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ThreadModel } from '../../../../../thread/queries/get-thread-model.ts';

export const THREAD_REMOVE_MODAL_NAME = 'remove-thread';

export const ThreadRemoveModal = ({
  id
}: Pick<ThreadModel, 'id'>) => {
  return (
    <div className="flex items-center justify-end w-full">
      <DialogWrapper
        name={THREAD_REMOVE_MODAL_NAME}
        trigger={
          <Button variant="negative">
            <Typography>Удалить тред</Typography>
          </Button>
        }
      >
        <ThreadRemoveConfirmation id={id} />
      </DialogWrapper>
    </div>
  );
};