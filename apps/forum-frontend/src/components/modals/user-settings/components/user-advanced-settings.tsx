import { Typography } from "@repo/ui/src/components/typography.tsx";
import CopperHorn from "@repo/assets/images/minecraft/copper-horn.webp";
import Paper from "@repo/assets/images/minecraft/paper.webp";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { globalPreferencesQuery } from "@repo/lib/queries/global-preferences-query.ts";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences.ts";
import Bell from "@repo/assets/images/minecraft/bell.webp";
import { useUpdateUserSettings } from "@repo/lib/hooks/use-update-user-settings.ts";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import Board from "@repo/assets/images/minecraft/chalkboard_board.webp"
import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import { UserSettingsBack } from "#components/modals/user-settings/components/user-settings-back";
import FutureChickenMini from "@repo/assets/images/minecraft/future_chicken_mini.png"

const AlertsSetting = () => {
  const { alerts } = globalPreferencesQuery().data
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return (
    <UserSettingOption title="Объявления" imageSrc={CopperHorn}>
      <Switch
        checked={alerts === "show"}
        defaultChecked={alerts === "show"}
        onCheckedChange={_ => updateShowingMutation.mutate("alerts")}
      />
    </UserSettingOption>
  )
}

const IntroSetting = () => {
  const { intro } = globalPreferencesQuery().data
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return (
    <UserSettingOption title="Интро" imageSrc={Board}>
      <Switch
        checked={intro === "show"}
        defaultChecked={intro === "show"}
        onCheckedChange={_ => updateShowingMutation.mutate("intro")}
      />
    </UserSettingOption>
  )
}

const HistoryThreadsSetting = () => {
  const { autoSaveThreads } = globalPreferencesQuery().data
  const { updateThreadsSavingMutation } = useUpdateGlobalPreferences()

  return (
    <UserSettingOption title="История тредов" imageSrc={Paper}>
      <Switch
        checked={autoSaveThreads}
        defaultChecked={autoSaveThreads}
        onCheckedChange={_ => updateThreadsSavingMutation.mutate()}
      />
    </UserSettingOption>
  )
}

const NotificationsSetting = () => {
  const { send_notifications } = getUser().preferences
  const { updateUserSettingsMutation } = useUpdateUserSettings()

  return (
    <UserSettingOption title="Уведомления" imageSrc={Bell}>
      <Switch
        checked={send_notifications}
        defaultChecked={send_notifications}
        onCheckedChange={_ => {
          updateUserSettingsMutation.mutate({
            setting: "send_notifications", value: !send_notifications
          })
        }}
      />
    </UserSettingOption>
  )
}

const ShowLocationSettings = () => {
  const { show_game_location } = getUser().preferences
  const { updateUserSettingsMutation } = useUpdateUserSettings()

  return (
    <UserSettingOption title="Отображение локации" imageSrc={FutureChickenMini}>
      <Switch
        checked={show_game_location}
        defaultChecked={show_game_location}
        onCheckedChange={_ => {
          updateUserSettingsMutation.mutate({
            setting: "show_game_location", value: !show_game_location
          })
        }}
      />
    </UserSettingOption>
  )
}

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