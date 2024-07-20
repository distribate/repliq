import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import {
  TerminateNotActiveSessionsModal
} from '../action-confirmation/components/terminate-session/components/terminate-not-active-sessions-modal.tsx';
import Barrier from "@repo/assets/images/minecraft/barrier.webp"

export const TERMINATE_ALL_SESSIONS_MODAL_NAME = "terminate-all-not-active-sessions"

export const TerminateAllSessionsModal = () => {
  return (
    <DialogWrapper
      name={TERMINATE_ALL_SESSIONS_MODAL_NAME}
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
    >
      <TerminateNotActiveSessionsModal/>
    </DialogWrapper>
  )
}