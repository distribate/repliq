import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { UserSettingOption } from "#components/user/settings/user-setting-option";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back";
import { reatomComponent } from "@reatom/npm-react";
import { globalPreferencesAtom, updateThreadsSettingAction, updateVisibilityAction } from "#components/user/settings/main/models/update-global-preferences.model";
import { updateCurrentUserSettingsAction } from "#components/user/settings/profile/models/update-current-user.model";
import { IconBellShare, IconFlag2, IconHistory, IconStepInto } from "@tabler/icons-react";
import { getUser } from "#components/user/models/current-user.model";

const AlertsSetting = reatomComponent(({ ctx }) => {
  const alerts = ctx.spy(globalPreferencesAtom).alerts

  return (
    <UserSettingOption title="Объявления" icon={{ value: IconFlag2 }}>
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
    <UserSettingOption title="Интро" icon={{ value: IconStepInto }}>
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
    <UserSettingOption title="История тредов" icon={{ value: IconHistory }}>
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
    <UserSettingOption title="Уведомления" icon={{ value: IconBellShare }}>
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

// const ShowLocationSettings = reatomComponent(({ ctx }) => {
//   const show_game_location = getUser(ctx).preferences.show_game_location

//   return (
//     <UserSettingOption title="Отображение локации" imageSrc={FutureChickenMini}>
//       <Switch
//         checked={show_game_location}
//         defaultChecked={show_game_location}
//         onCheckedChange={_ => {
//           updateCurrentUserSettingsAction(ctx, {
//             setting: "show_game_location", value: !show_game_location
//           })
//         }}
//       />
//     </UserSettingOption>
//   )
// }, "ShowLocationSettings")

export const UserAdvancedSettings = () => {
  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <UserSettingsBack />
      <Typography variant="dialogTitle">
        Дополнительные настройки
      </Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <AlertsSetting />
        <IntroSetting />
        <HistoryThreadsSetting />
        <NotificationsSetting />
      </div>
    </div>
  );
};