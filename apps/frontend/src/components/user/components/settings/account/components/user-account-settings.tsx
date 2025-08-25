import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { PasswordChange } from '#components/user/components/settings/account/components/password-change';
import { ActiveSessions } from '#components/user/components/settings/account/components/active-sessions';
import { UserSettingOption } from '#ui/user-setting-option';
import { UserSettingsBack } from '#components/modals/user-settings/components/user-settings-back.tsx';
import { Switch } from '@repo/ui/src/components/switch.tsx';
import { reatomComponent, useUpdate } from '@reatom/npm-react';
import { updateCurrentUserSettingsAction } from '#components/user/components/settings/profile/models/update-current-user.model';
import { spawn } from '@reatom/framework';
import { BlockedList } from '#components/user/components/settings/account/components/user-blocked-list';
import { EmailChange } from './email-change';
import { AccountDialog, navigateToDialogAction, settingsCurrentDialogAtom } from '../../../../../modals/user-settings/models/user-settings.model';
import { Skeleton } from '@repo/ui/src/components/skeleton';
import { userActiveSessionsAction } from '../../../../../modals/user-settings/models/user-sessions.model';
import { DeleteAccount } from './delete-account';
import { IconDeviceDesktopPin, IconFileXFilled, IconHandMiddleFinger, IconHeartHandshake, IconLock, IconMailSpark, IconTag } from '@tabler/icons-react';
import { getUser } from '#components/user/models/current-user.model';
import { ReactNode } from 'react';

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
      icon={{ value: IconHeartHandshake }}
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
    <UserSettingOption title="Реальное имя" icon={{ value: IconTag }}>
      <Switch
        checked={real_name_visible}
        defaultChecked={real_name_visible}
        onCheckedChange={v => handleRealNameVisibility(v)}
      />
    </UserSettingOption>
  );
}, "RealNameVisibility")

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
        icon={{ value: IconDeviceDesktopPin }}
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
                icon={{ value: IconMailSpark }}
              />
              <UserSettingOption
                onClick={() => navigateToDialogAction(ctx, "password")}
                title="Пароль"
                icon={{ value: IconLock }}
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
                <RealNameVisibility />
                <FriendRequest />
                <UserSettingOption
                  onClick={() => navigateToDialogAction(ctx, "black-list")}
                  title="Черный список"
                  icon={{ value: IconHandMiddleFinger }}
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
              icon={{ value: IconFileXFilled }}
            />
          </div>
        </>
      )}
    </div >
  );
}, "UserAccountSettingsCard")