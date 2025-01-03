import { Typography } from "@repo/ui/src/components/typography.tsx";
import CopperHorn from "@repo/assets/images/minecraft/copper-horn.webp";
import Paper from "@repo/assets/images/minecraft/paper.webp";
import { UserSettingOption } from "../profile-settings/user-profile-settings.tsx";
import { Switch } from "@repo/ui/src/components/switch.tsx";
import { globalPreferencesQuery} from "@repo/lib/queries/global-preferences-query.ts";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences.ts";

export const UserAdvancedSettings = () => {
  const { data: globalPreferencesState } = globalPreferencesQuery()
  const { updateAlertsShowingMutation, updateThreadsSavingMutation } = useUpdateGlobalPreferences()
  const { alerts, autoSaveThreads } = globalPreferencesState

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Дополнительные настройки</Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <UserSettingOption title="Объявления" imageSrc={CopperHorn.src}>
          <Switch
            checked={alerts === "show"}
            defaultChecked={alerts === "show"}
            onCheckedChange={_ => updateAlertsShowingMutation.mutate()}
          />
        </UserSettingOption>
        <UserSettingOption title="История тредов" imageSrc={Paper.src}>
          <Switch
            checked={autoSaveThreads}
            defaultChecked={autoSaveThreads}
            onCheckedChange={_ => updateThreadsSavingMutation.mutate()}
          />
        </UserSettingOption>
      </div>
    </div>
  );
};
