import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import { DescriptionInput } from './components/description-input.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { OutlineCover } from './components/outline-cover.tsx';
import { useQueryClient } from '@tanstack/react-query';
import Firework from '@repo/assets/images/minecraft/firework.webp';
import BlueDye from '@repo/assets/images/minecraft/blue_dye.webp';
import Nametag from '@repo/assets/images/minecraft/nametag.webp';
import Barrier from '@repo/assets/images/minecraft/barrier.webp';
import DiamondPickaxe from '@repo/assets/images/minecraft/diamond_pickaxe.webp';
import Lead from '@repo/assets/images/minecraft/lead.webp';
import { RealNameChangeModal } from '#modals/user-settings/real-name-change-modal.tsx';
import { NicknameColorPickerModal } from '#modals/user-settings/nickname-color-picker-modal.tsx';
import { FavoriteItemModal } from '#modals/user-settings/favorite-item-modal.tsx';
import { ReactNode } from 'react';
import { ProfileVisibilityChange } from './components/visibility-profile/components/profile-visibility-change.tsx';
import { DateBirthdayModal } from '#modals/user-settings/date-birthday-modal.tsx';

type ProfileSetting = {
  title: string,
  imageSrc?: string,
  children?: ReactNode,
}

export const UserSettingOption = ({
  title, children, imageSrc,
}: ProfileSetting) => {
  return (
    <HoverCardItem className="justify-between w-full">
      <div className="flex gap-x-2 items-center w-full">
        {imageSrc && (
          <ImageWrapper
            propSrc={imageSrc} propAlt={title} width={32}
            className="max-w-[40px] max-h-[40px]" height={32}
          />
        )}
        <Typography className="text-base">{title}</Typography>
      </div>
      <div className="min-w-fit">
        {children || ' '}
      </div>
    </HoverCardItem>
  );
};

export const UserProfileSettings = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  if (!currentUser) return;
  
  const isAccess = currentUser.donate !== 'default';
  
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Профиль</Typography>
      <div className="flex flex-col w-full gap-y-4">
        <DescriptionInput />
        <div className="flex flex-col bg-white/10 w-full py-2 px-4">
          <Typography className="text-base text-shark-200">
            Расскажи о своем возрасте или чем занимаешься?
          </Typography>
          <Typography className="text-base text-shark-200">
            Например: 20-ти летний майнкрафтер из Москвы
          </Typography>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <UserSettingOption title="Тип аккаунта:" imageSrc={Barrier.src}>
          <ProfileVisibilityChange />
        </UserSettingOption>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <UserSettingOption title="День рождения" imageSrc={Firework.src}>
          <DateBirthdayModal />
        </UserSettingOption>
        <UserSettingOption title="Реальное имя" imageSrc={Nametag.src}>
          <RealNameChangeModal />
        </UserSettingOption>
        {/* with donate access*/}
        {isAccess && (
          <>
            <Separator className="relative bg-authentic-background brightness-150 mb-2">
              <Typography className="absolute z-2 -top-0 left-0 text-authentic-background font-[Minecraft] text-[14px]">
                only Authentic+
              </Typography>
            </Separator>
            <UserSettingOption title="Цвет никнейма" imageSrc={BlueDye.src}>
              <NicknameColorPickerModal />
            </UserSettingOption>
            <UserSettingOption title="Обводка вокруг шапки профиля" imageSrc={Lead.src}>
              <OutlineCover />
            </UserSettingOption>
            <UserSettingOption title="Любимый предмет" imageSrc={DiamondPickaxe.src}>
              <FavoriteItemModal />
            </UserSettingOption>
          </>
        )}
      </div>
    </div>
  );
};