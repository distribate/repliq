import { THREAD } from '@repo/types/entities/entities-type.ts';
import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { ThreadRemoveConfirmation } from './thread-remove-confirmation.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

export const THREAD_REMOVE_MODAL_NAME = 'remove-thread';

type ThreadRemoveModal = Pick<THREAD, 'id'>

export const ThreadRemoveModal = ({
  id,
}: ThreadRemoveModal) => {
  return (
    <DialogWrapper
      name={THREAD_REMOVE_MODAL_NAME}
      properties={{
        dialogTriggerClassName: 'w-full',
      }}
      trigger={
        <HoverCardItem>
          <Typography className="text-red-500">
            Удалить тред
          </Typography>
        </HoverCardItem>
      }
    >
      <ThreadRemoveConfirmation id={id} />
    </DialogWrapper>
  );
};