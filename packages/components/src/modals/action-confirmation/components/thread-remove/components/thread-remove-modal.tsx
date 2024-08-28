import { Button } from '@repo/ui/src/components/button.tsx';
import { THREAD } from '@repo/types/entities/entities-type.ts';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { ThreadRemoveConfirmation } from './thread-remove-confirmation.tsx';

export const THREAD_REMOVE_MODAL_NAME = "remove-thread"

type ThreadRemoveModal = Pick<THREAD, "id">

export const ThreadRemoveModal = ({
  id
}: ThreadRemoveModal) => {
  return (
    <DialogWrapper
      name={THREAD_REMOVE_MODAL_NAME}
      trigger={
        <Button>
          Удалить
        </Button>
      }
    >
      <ThreadRemoveConfirmation id={id} />
    </DialogWrapper>
  )
}