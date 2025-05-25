import { Typography } from "@repo/ui/src/components/typography.tsx";
import CopperHorn from "@repo/assets/images/minecraft/copper-horn.webp";
import Paper from "@repo/assets/images/minecraft/paper.webp";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { globalPreferencesAtom } from "@repo/lib/queries/global-preferences-query.ts";
import Bell from "@repo/assets/images/minecraft/bell.webp";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import Board from "@repo/assets/images/minecraft/chalkboard_board.webp"
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back";
import FutureChickenMini from "@repo/assets/images/minecraft/future_chicken_mini.png"
import { reatomComponent } from "@reatom/npm-react";
import { updateThreadsSettingAction, updateVisibilityAction } from "@repo/lib/hooks/update-global-preferences.model";
import { updateCurrentUserSettingsAction } from "#components/cards/user-personal-card/components/profile-settings/models/update-current-user.model";

const AlertsSetting = reatomComponent(({ ctx }) => {
  const alerts = ctx.spy(globalPreferencesAtom).alerts

  return (
    <UserSettingOption title="Объявления" imageSrc={CopperHorn}>
      <Switch
        checked={alerts === "show"}
        defaultChecked={alerts === "show"}
        onCheckedChange={_ => updateVisibilityAction(ctx, "alerts")}
      />
    </UserSettingOption>
  )
}, "AlertsSetting")

const IntroSetting = reatomComponent(({ ctx }) => {
  const intro = ctx.spy(globalPreferencesAtom).intro

  return (
    <UserSettingOption title="Интро" imageSrc={Board}>
      <Switch
        checked={intro === "show"}
        defaultChecked={intro === "show"}
        onCheckedChange={_ => updateVisibilityAction(ctx, "intro")}
      />
    </UserSettingOption>
  )
}, "IntroSetting")

const HistoryThreadsSetting = reatomComponent(({ ctx }) => {
  const autoSaveThreads = ctx.spy(globalPreferencesAtom).autoSaveThreads

  return (
    <UserSettingOption title="История тредов" imageSrc={Paper}>
      <Switch
        checked={autoSaveThreads}
        defaultChecked={autoSaveThreads}
        onCheckedChange={_ => updateThreadsSettingAction(ctx)}
      />
    </UserSettingOption>
  )
}, "HistoryThreadsSetting")

const NotificationsSetting = reatomComponent(({ ctx }) => {
  const send_notifications = getUser(ctx).preferences.send_notifications

  return (
    <UserSettingOption title="Уведомления" imageSrc={Bell}>
      <Switch
        checked={send_notifications}
        defaultChecked={send_notifications}
        onCheckedChange={_ => {
          updateCurrentUserSettingsAction(ctx, {
            setting: "send_notifications", value: !send_notifications
          })
        }}
      />
    </UserSettingOption>
  )
}, "NotificationsSetting")

const ShowLocationSettings = reatomComponent(({ ctx }) => {
  const show_game_location = getUser(ctx).preferences.show_game_location

  return (
    <UserSettingOption title="Отображение локации" imageSrc={FutureChickenMini}>
      <Switch
        checked={show_game_location}
        defaultChecked={show_game_location}
        onCheckedChange={_ => {
          updateCurrentUserSettingsAction(ctx, {
            setting: "show_game_location", value: !show_game_location
          })
        }}
      />
    </UserSettingOption>
  )
}, "ShowLocationSettings")

export const UserAdvancedSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack to="main" />
      <Typography variant="dialogTitle">
        Дополнительные настройки
      </Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <AlertsSetting />
        <IntroSetting />
        <HistoryThreadsSetting />
        <NotificationsSetting />
        <ShowLocationSettings />
      </div>
    </div>
  );
};