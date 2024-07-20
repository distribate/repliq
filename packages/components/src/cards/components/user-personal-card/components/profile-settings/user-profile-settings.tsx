import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { ImageWrapper } from '../../../../../wrappers/image-wrapper.tsx';
import { DescriptionInput } from './components/description-input.tsx';
import { ProfileVisibilityChange } from './components/visibility-change.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { DateBirthdayPicker } from './components/date-birthday-picker.tsx';
import { DropdownWrapper } from '../../../../../wrappers/dropdown-wrapper.tsx';
import { OutlineCover } from './components/outline-cover.tsx';
import { useQueryClient } from '@tanstack/react-query';

import Firework from '@repo/assets/images/minecraft/firework.webp';
import BlueDye from '@repo/assets/images/minecraft/blue_dye.webp';
import Nametag from '@repo/assets/images/minecraft/nametag.webp';
import Barrier from '@repo/assets/images/minecraft/barrier.webp';
import DiamondPickaxe from '@repo/assets/images/minecraft/diamond_pickaxe.webp';
import Lead from '@repo/assets/images/minecraft/lead.webp';
import { RealNameChangeModal } from '../../../../../modals/user-settings/real-name-change-modal.tsx';
import { NicknameColorPickerModal } from '../../../../../modals/user-settings/nickname-color-picker-modal.tsx';
import { FavoriteItemModal } from '../../../../../modals/user-settings/favorite-item-modal.tsx';

export const UserProfileSettings = () => {
  const qc = useQueryClient()
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  
  if (!currentUser) return null;
  
  const { nickname, name_color, visibility, favorite_item, birthday, donate, real_name } = currentUser;

  const isAccess = donate !== 'default';
  
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
        <HoverCardItem className="justify-between w-full">
          <div className="flex gap-x-2 items-center w-full">
            <ImageWrapper
              propSrc={Barrier.src} propAlt="Page private" width={32}
              className="max-w-[40px] max-h-[40px]" height={32}
            />
            <Typography className="text-base">Тип аккаунта:</Typography>
          </div>
          <div className="w-fit">
            <ProfileVisibilityChange visibility={visibility} />
          </div>
        </HoverCardItem>
      </div>
      <Separator />
      <div className="flex flex-col w-full gap-y-4">
        <HoverCardItem className="justify-between w-full">
          <div className="flex gap-x-2 items-center grow">
            <ImageWrapper
              propSrc={Firework.src} propAlt="Page private" width={32}
              className="max-w-[40px] max-h-[40px]" height={32}
            />
            <Typography className="text-base">День рождения:</Typography>
          </div>
          <div className="w-fit">
            <DropdownWrapper
              properties={{ contentAlign: 'end', sideAlign: 'right' }}
              trigger={
                <Typography className="text-base">
                  {birthday ? birthday.toString() : `не указано`}
                </Typography>
              }
              content={<DateBirthdayPicker />}
            />
          </div>
        </HoverCardItem>
        <HoverCardItem className="justify-between w-full">
          <div className="flex gap-x-2 items-center grow">
            <ImageWrapper
              propSrc={Nametag.src} propAlt="Page private" width={32}
              className="max-w-[40px] max-h-[40px]" height={32}
            />
            <Typography className="text-base">Реальное имя:</Typography>
          </div>
          <RealNameChangeModal real_name={real_name}/>
        </HoverCardItem>
        
        {/* with donate access*/}
        {isAccess && (
          <>
            <Separator className="relative bg-authentic-background brightness-150 mb-2">
              <Typography
                className="absolute z-2 -top-0 left-0 text-authentic-background font-[Minecraft] text-[14px]">
                only Authentic+
              </Typography>
            </Separator>
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center grow">
                <ImageWrapper
                  propSrc={BlueDye.src} propAlt="Page private" width={32}
                  className="max-w-[40px] max-h-[40px]" height={32}
                />
                <Typography className="text-base">Цвет никнейма</Typography>
              </div>
             <NicknameColorPickerModal nickname={nickname} name_color={name_color}/>
            </HoverCardItem>
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center grow">
                <ImageWrapper
                  propSrc={Lead.src} propAlt="Page private"
                  width={32} className="max-w-[40px] max-h-[40px]" height={32}
                />
                <Typography className="text-base">
                  Обводка вокруг шапки профиля
                </Typography>
              </div>
              <div className="w-fit">
                <OutlineCover />
              </div>
            </HoverCardItem>
            <HoverCardItem className="justify-between w-full">
              <div className="flex gap-x-2 items-center grow">
                <ImageWrapper
                  propSrc={DiamondPickaxe.src} propAlt="Page private"
                  width={32} className="max-w-[40px] max-h-[40px]" height={32}
                />
                <Typography className="text-base">
                  Любимый предмет
                </Typography>
              </div>
             <FavoriteItemModal favorite_item={favorite_item}/>
            </HoverCardItem>
          </>
        )}
      </div>
    </div>
  );
};