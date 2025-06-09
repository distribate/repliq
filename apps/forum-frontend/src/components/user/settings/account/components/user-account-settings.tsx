import IronHelmet from '@repo/assets/images/minecraft/iron_helmet.webp';
import AllaySpawnEgg from '@repo/assets/images/minecraft/allay_spawn_egg.webp';
import WildArmorTrim from '@repo/assets/images/minecraft/wild_armor_trim_ыmithing_еemplate.webp';
import FancyFeather from '@repo/assets/images/minecraft/fancy_feather.webp';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { PasswordChange } from '#components/user/settings/account/components/password-change';
import { ActiveSessions } from '#components/user/settings/account/components/active-sessions';
import { UserSettingOption } from '#components/user/settings/user-setting-option';
import { UserSettingsBack } from '#components/modals/user-settings/components/user-settings-back.tsx';
import { Switch } from '@repo/ui/src/components/switch.tsx';
import { getUser } from '@repo/lib/helpers/get-user';
import { reatomComponent, useUpdate } from '@reatom/npm-react';
import { updateCurrentUserSettingsAction } from '#components/user/settings/profile/models/update-current-user.model';
import { spawn } from '@reatom/framework';
import { BlockedList } from '#components/cards/user-blocked-card/components/user-blocked-list';
import { EmailChange } from './email-change';
import { ReactNode } from '@tanstack/react-router';
import { AccountDialog, navigateToDialogAction, settingsCurrentDialogAtom } from '../../../../modals/user-settings/models/user-settings.model';
import BannerPattern from "@repo/assets/images/minecraft/banner_pattern.webp";
import GoldIngot from "@repo/assets/images/minecraft/gold_ingot.webp";
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { userActiveSessionsAction } from '../../../../modals/user-settings/models/user-sessions.model';
import YellowCandle from "@repo/assets/images/minecraft/yellow_candle.webp";
import ExpNoActive from "@repo/assets/images/minecraft/exp-noactive.webp";
import { DeleteAccount } from './delete-account';

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

const BlackListModel = () => {
  return (
    <div className="flex flex-col gap-y-4 w-full items-center">
      <Typography variant="dialogTitle" className="px-4">
        Черный список
      </Typography>
      <BlockedList />
    </div>
  )
}

const ACCOUNT_SETTINGS_SECTIONS: Record<AccountDialog, ReactNode> = {
  email: <EmailChange />,
  password: <PasswordChange />,
  "black-list": <BlackListModel />,
  sessions: <ActiveSessions />,
  "delete-account": <DeleteAccount />
}

const SyncSessions = () => {
  useUpdate(userActiveSessionsAction, [userActiveSessionsAction])
  return null;
}

const ActiveSessionsOption = reatomComponent(({ ctx }) => {
  return (
    <>
      <SyncSessions />
      <UserSettingOption
        onClick={() => navigateToDialogAction(ctx, "sessions")}
        title="Активные сессии"
        imageSrc={YellowCandle}
      >
        {ctx.spy(userActiveSessionsAction.statusesAtom).isPending ? (
          <Skeleton className="rounded-md h-4 w-4" />
        ) : (
          <Typography className="text-base">
            {ctx.spy(userActiveSessionsAction.dataAtom)?.length ?? 0}
          </Typography>
        )}
      </UserSettingOption>
    </>
  )
}, "ActiveSessionsOption")

export const UserAccountSettings = reatomComponent(({ ctx }) => {
  const current = ctx.spy(settingsCurrentDialogAtom)

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack />
      {current && ACCOUNT_SETTINGS_SECTIONS[current as AccountDialog]}
      {!current && (
        <>
          <Typography variant="dialogTitle">Аккаунт</Typography>
          <div className="flex flex-col gap-y-6 w-full">
            <div className="flex flex-col gap-y-4 w-full">
              <Typography variant="dialogSubtitle" className="px-2">
                Защита
              </Typography>
              <UserSettingOption
                onClick={() => navigateToDialogAction(ctx, "email")}
                title="Почта"
                imageSrc={BannerPattern}
              />
              <UserSettingOption
                onClick={() => navigateToDialogAction(ctx, "password")}
                title="Пароль"
                imageSrc={GoldIngot}
              />
              <ActiveSessionsOption />
              <div className="flex flex-col gap-y-2 w-full">
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
                <UserSettingOption
                  onClick={() => navigateToDialogAction(ctx, "black-list")}
                  title="Черный список"
                  imageSrc={IronHelmet}
                />
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
            <UserSettingOption
              onClick={() => navigateToDialogAction(ctx, "delete-account")}
              title="Удалить аккаунт"
              imageSrc={ExpNoActive}
            />
          </div>
        </>
      )}
    </div >
  );
}, "UserAccountSettingsCard")