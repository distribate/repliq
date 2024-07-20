import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import {
  UserActiveSessions
} from '../../cards/components/user-personal-card/components/account-settings/components/user-active-sessions.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  userActiveSessionsQuery
} from '../../cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts';
import YellowCandle from '@repo/assets/images/minecraft/yellow_candle.webp';

export const ACTIVE_SESSIONS_MODAL_NAME = "active-sessions"

export const ActiveSessionsModal = () => {
  const { data: activeSessions, isLoading } = userActiveSessionsQuery();
  
  return (
    <DialogWrapper
      name={ACTIVE_SESSIONS_MODAL_NAME}
      trigger={
        <HoverCardItem className="justify-between w-full">
          <div className="flex gap-x-2 items-center w-full px-2">
            <ImageWrapper
              propSrc={YellowCandle?.src}
              width={32}
              height={32}
              loading="eager"
              propAlt="Change description"
            />
            <Typography className="text-base">Активные сессии</Typography>
          </div>
          {isLoading ? (
            <Skeleton className="rounded-md h-4 w-4" />
          ) : (
            <Typography className="text-base">
              {activeSessions?.length}
            </Typography>
          )}
        </HoverCardItem>
      }
    >
      <UserActiveSessions />
    </DialogWrapper>
  )
}