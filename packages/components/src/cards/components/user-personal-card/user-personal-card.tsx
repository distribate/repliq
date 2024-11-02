import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Avatar } from '#user/components/avatar/components/avatar.tsx';
import { UserNickname } from '#user/components/name/components/nickname.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import Portfolio from '@repo/assets/images/minecraft/portfolio.webp';
import { ProfileSettingsModal } from '#modals/custom/profile-settings-modal.tsx';
import { AccountSettingsModal } from '#modals/custom/account-settings-modal.tsx';
import { AdvancedSettingsModal } from '#modals/custom/advanced-settings-modal.tsx';
import { TicketsModal } from '#modals/custom/tickets-modal.tsx';
import { UserSettingOption } from './components/profile-settings/user-profile-settings.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

const UserPersonalCardHeader = () => {
  const currentUser = getUser();
  if (!currentUser) return null;
  
  const { nickname, name_color } = currentUser;
  
  return (
    <>
      <Avatar propHeight={96} propWidth={96} nickname={nickname} />
      <div className="flex flex-col items-center">
        <UserNickname
          nickname={nickname}
          nicknameColor={name_color}
          className="text-base font-bold"
        />
        <Typography>онлайн</Typography>
      </div>
    </>
  );
};

export const UserPersonalCard = () => {
  return (
    <div className="flex flex-col gap-y-4 pt-4 items-center w-full">
      <UserPersonalCardHeader />
      <Separator />
      <div className="flex flex-col gap-y-2 w-full">
        <ProfileSettingsModal />
        <AccountSettingsModal />
        <AdvancedSettingsModal />
        <Separator />
        <TicketsModal
          trigger={
            <UserSettingOption title="Задать вопрос" imageSrc={Portfolio.src}/>
          }
        />
      </div>
    </div>
  );
}