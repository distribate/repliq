import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '../../../user/components/avatar/components/avatar.tsx';
import { UserNickname } from '../../../user/components/name/components/nickname.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { TicketsModal } from '../../../modals/tickets-modal.tsx';
import { AccountSettingsModal } from '../../../modals/account-settings-modal.tsx';
import { ProfileSettingsModal } from '../../../modals/profile-settings-modal.tsx';
import { AdvancedSettingsModal } from '../../../modals/advanced-settings-modal.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ImageWrapper } from '../../../wrappers/image-wrapper.tsx';
import Portfolio from '@repo/assets/images/minecraft/portfolio.webp';

export const UserPersonalCard = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return;
  
  const { nickname, name_color } = currentUser;
  
  return (
    <div className="flex flex-col gap-y-4 pt-4 items-center w-full">
      <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      <div className="flex flex-col items-center">
        <UserNickname nickname={nickname} nicknameColor={name_color} className="text-base font-bold" />
        <Typography>онлайн</Typography>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <ProfileSettingsModal />
        <AccountSettingsModal />
        <AdvancedSettingsModal />
        <Separator />
        <TicketsModal
          trigger={
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center w-full">
                <ImageWrapper
                  propSrc={Portfolio?.src}
                  width={26}
                  height={26}
                  loading="eager"
                  propAlt="Change description"
                />
                <Typography className="text-base">Задать вопрос</Typography>
              </div>
            </HoverCardItem>
          }
        />
      </div>
    </div>
  );
};