import { Typography } from '@repo/ui/src/components/typography.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import IronHelmet from '@repo/assets/images/minecraft/iron_helmet.webp';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import {
  userBlockedAction,
} from '#components/modals/user-settings/queries/user-blocked-query';
import { UserBlockedCard } from '#components/cards/user-blocked-card/components/user-blocked-card.tsx';
import { ContentNotFound } from '#components/templates/components/content-not-found';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { PasswordChangeModal } from '#components/modals/user-settings/components/password-change-modal.tsx';
import { ActiveSessionsModal } from '#components/modals/user-settings/components/active-sessions-modal.tsx';
import { UserSettingOption } from '#components/cards/user-setting-option-card/components/user-setting-option';
import { UserSettingsBack } from '#components/modals/user-settings/components/user-settings-back.tsx';
import AllaySpawnEgg from '@repo/assets/images/minecraft/allay_spawn_egg.webp';
import { Switch } from '@repo/ui/src/components/switch.tsx';
import WildArmorTrim from '@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp';
import FancyFeather from '@repo/assets/images/minecraft/fancy_feather.webp';
import { getUser } from '@repo/lib/helpers/get-user';
import { reatomComponent } from '@reatom/npm-react';
import { updateCurrentUserSettingsAction } from '#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model';
import { onConnect, spawn } from '@reatom/framework';

onConnect(userBlockedAction.dataAtom, userBlockedAction)

const BlockedList = reatomComponent(({ ctx }) => {
  const usersBlocked = ctx.spy(userBlockedAction.dataAtom)
  const isLoading = ctx.spy(userBlockedAction.statusesAtom).isPending

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
}, "BlockedList")

const FriendRequest = reatomComponent(({ ctx }) => {
  const accept_friend_request = getUser(ctx).preferences.accept_friend_request

  const handleToggleFriendRequest = (value: boolean) => {
    if (value === accept_friend_request) return;

    void spawn(ctx, async (spawnCtx) => updateCurrentUserSettingsAction(spawnCtx, {
      setting: "accept_friend_request", value
    }))
  }

  return (
    <UserSettingOption
      title="Заявки в друзья"
      imageSrc={AllaySpawnEgg}
    >
      <Switch
        checked={accept_friend_request}
        defaultChecked={accept_friend_request}
        onCheckedChange={v => handleToggleFriendRequest(v)}
      />
    </UserSettingOption>
  );
}, "FriendRequest")

const RealNameVisibility = reatomComponent(({ ctx }) => {
  const real_name_visible = getUser(ctx).preferences.real_name_visible;

  const handleRealNameVisibility = (value: boolean) => {
    if (value === real_name_visible) return;

    void spawn(ctx, async (spawnCtx) => updateCurrentUserSettingsAction(spawnCtx, {
      setting: 'real_name_visible', value,
    }))
  };

  return (
    <UserSettingOption title="Реальное имя" imageSrc={FancyFeather}>
      <Switch
        checked={real_name_visible}
        defaultChecked={real_name_visible}
        onCheckedChange={v => handleRealNameVisibility(v)}
      />
    </UserSettingOption>
  );
}, "RealNameVisibility")

const GameStatsVisibility = reatomComponent(({ ctx }) => {
  const game_stats_visible = getUser(ctx).preferences.game_stats_visible;

  const handleGameStatsVisibility = (value: boolean) => {
    if (value === game_stats_visible) return;

    void spawn(ctx, async (spawnCtx) => 
      updateCurrentUserSettingsAction(spawnCtx, { setting: 'game_stats_visible', value })
    );
  };

  return (
    <UserSettingOption title="Игровая статистика" imageSrc={WildArmorTrim}>
      <Switch
        checked={game_stats_visible}
        defaultChecked={game_stats_visible}
        onCheckedChange={v => handleGameStatsVisibility(v)}
      />
    </UserSettingOption>
  )
}, "GameStatsVisibility")

export const UserAccountSettingsCard = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack to="main" />
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
            <GameStatsVisibility />
            <RealNameVisibility />
            <FriendRequest />
            <Dialog>
              <DialogTrigger>
                <UserSettingOption title="Черный список" imageSrc={IronHelmet} />
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