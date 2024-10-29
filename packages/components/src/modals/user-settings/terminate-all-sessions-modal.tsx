import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import Barrier from '@repo/assets/images/minecraft/barrier.webp';
import { ConfirmationActionModalTemplate } from '../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../buttons/confirmation-action-button.tsx';
import {
  TERMINATE_SESSIONS_MUTATION_KEY,
  useTerminateSession,
} from '../action-confirmation/components/terminate-session/hooks/use-terminate-session.ts';
import { DynamicModal } from '../dynamic-modal.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';

export const TERMINATE_ALL_SESSIONS_MODAL_NAME = 'terminate-all-not-active-sessions';

export const TerminateAllSessionsModal = () => {
  const { terminateMutation } = useTerminateSession();
  
  const handleAllTerminate = () => {
    return terminateMutation.mutate({ type: 'all' });
  };
  
  return (
    <DynamicModal
      mutationKey={TERMINATE_SESSIONS_MUTATION_KEY}
      trigger={
        <HoverCardItem className="gap-2 px-2">
          <ImageWrapper
            propSrc={Barrier.src}
            propAlt="Page private"
            width={32}
            className="max-w-[40px] max-h-[40px]"
            height={32}
          />
          <Typography className="text-base">
            Выйти с остальных сессий
          </Typography>
        </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title="Уверены, что хотите уничтожить все остальные сессии?">
          <ConfirmationButton
            actionType="continue"
            title="Да, уничтожить"
            onClick={handleAllTerminate}
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
  );
};