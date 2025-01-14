import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import IronHelmet from '@repo/assets/images/minecraft/iron_helmet.webp';
import FancyFeather from '@repo/assets/images/minecraft/fancy_feather.webp';
import AllaySpawnEgg from '@repo/assets/images/minecraft/allay_spawn_egg.webp';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import WildArmorTrim from '@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp';
import { RealNameVisibility } from './components/real-name-visibility.tsx';
import { GameStatsVisibility } from './components/game-stats-visibility.tsx';
import { FriendRequest } from './components/friend-request.tsx';
import { UserSettingOption } from '../profile-settings/user-profile-settings.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import {
  userBlockedQuery,
} from '#cards/components/user-personal-card/components/account-settings/queries/user-blocked-query.ts';
import { UserBlockedCard } from '#cards/components/user-blocked-card/components/user-blocked-card.tsx';
import { ContentNotFound } from '#templates/content-not-found.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
// import { EmailChangeModal } from '#modals/user-settings/email-change-modal.tsx';
import { PasswordChangeModal } from '#modals/user-settings/password-change-modal.tsx';
import { ActiveSessionsModal } from '#modals/user-settings/active-sessions-modal.tsx';

const BlockedList = () => {
  const currentUser = getUser();
  const { data: usersBlocked, isLoading } = userBlockedQuery(currentUser.nickname);

  return (
    <>
      <div className="flex flex-col gap-y-1 w-full overflow-y-scroll max-h-[600px]">
        {isLoading && (
          <>
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
          </>
        )}
        {(!isLoading && usersBlocked) && (
          usersBlocked.map((user) => (
            <UserBlockedCard
              key={user.id}
              name_color={user.name_color!}
              nickname={user.nickname!}
              time={user.created_at!}
            />
          ))
        )}
        {!isLoading && !usersBlocked && (
          <ContentNotFound title="Никого нет в черном списке" />
        )}
      </div>
    </>
  );
};

export const UserSettingsCard = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Аккаунт</Typography>
      <div className="flex flex-col gap-y-6 w-full">
        <div className="flex flex-col gap-y-4 w-full">
          <Typography variant="dialogSubtitle" className="px-2">
            Защита
          </Typography>
          <div className="flex flex-col gap-y-2 w-full">
            {/* <EmailChangeModal /> */}
            <PasswordChangeModal />
            <ActiveSessionsModal />
            <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
              <Typography className="text-base text-shark-200">
                Управление текущими сессиями
              </Typography>
            </div>
          </div>
          <Separator />
        </div>
        <div className="flex flex-col gap-y-4 w-full">
          <Typography variant="dialogSubtitle" className="px-2">
            Приватность
          </Typography>
          <div className="flex flex-col gap-y-2 w-full">
            <UserSettingOption
              title="Игровая статистика"
              imageSrc={WildArmorTrim.src}
            >
              <GameStatsVisibility />
            </UserSettingOption>
            <UserSettingOption title="Реальное имя" imageSrc={FancyFeather.src}>
              <RealNameVisibility />
            </UserSettingOption>
            <UserSettingOption
              title="Заявки в друзья"
              imageSrc={AllaySpawnEgg.src}
            >
              <FriendRequest />
            </UserSettingOption>
            <Dialog>
              <DialogTrigger>
                <UserSettingOption title="Черный список" imageSrc={IronHelmet.src} />
              </DialogTrigger>
              <DialogContent>
                <div className="flex flex-col gap-y-4 w-full items-center">
                  <Typography variant="dialogTitle" className="px-4">
                    Черный список
                  </Typography>
                  <BlockedList />
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex flex-col bg-secondary-color w-full py-2 px-4">
              <Typography className="text-base text-shark-200">
                Приватность профиля и аккаунта
              </Typography>
            </div>
            <Separator />
          </div>
        </div>
      </div>
      <div className="w-full">
        <HoverCardItem className="px-4 cursor-pointer">
          <Typography className="text-red-500" textSize="medium">
            Удалить аккаунт
          </Typography>
        </HoverCardItem>
      </div>
    </div>
  );
};
