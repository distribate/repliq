import { THREAD } from '@repo/types/entities/entities-type.ts';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { ThreadRemoveConfirmation } from './thread-remove-confirmation.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';

export const THREAD_REMOVE_MODAL_NAME = "remove-thread"

type ThreadRemoveModal = Pick<THREAD, "id">

export const ThreadRemoveModal = ({
  id
}: ThreadRemoveModal) => {
  return (
    <DialogWrapper
      name={THREAD_REMOVE_MODAL_NAME}
      trigger={
        <Button
          className="bg-shark-800 hover:bg-shark-700 gap-2 group items-center"
        >
          Удалить
        </Button>
      }
    >
      <ThreadRemoveConfirmation id={id} />
    </DialogWrapper>
  )
}