import { Typography } from "@repo/ui/src/components/typography.tsx";
import CopperHorn from "@repo/assets/images/minecraft/copper-horn.webp";
import { useCallback, useEffect, useState } from "react";
import { hasAlertsShow } from "@repo/lib/actions/has-alerts.ts";
import { setAlerts } from "@repo/lib/actions/set-alerts.ts";
import { usePreferences } from "./hooks/use-preferences.ts";
import Paper from "@repo/assets/images/minecraft/paper.webp";
import { UserSettingOption } from "../profile-settings/user-profile-settings.tsx";
import { disableAlerts } from "#alert/queries/disable-alerts.ts";

export const UserAdvancedSettings = () => {
  const [isAlerts, setIsAlerts] = useState<boolean | null>(null);
  const { preferences, setAutoSaveThreads } = usePreferences();

  useEffect(() => {
    hasAlertsShow().then((res) => setIsAlerts(res));
  }, [isAlerts]);

  const enableAlerts = useCallback(() => {
    if (isAlerts) {
      disableAlerts().then();
    } else {
      setAlerts().then();
    }

    setIsAlerts(!isAlerts);
  }, [isAlerts]);

  return (
    <div className="flex flex-col gap-y-4 items-center w-full">
      <Typography variant="dialogTitle">Дополнительные настройки</Typography>
      <div className="flex flex-col gap-y-2 w-full">
        <UserSettingOption title="Объявления" imageSrc={CopperHorn.src}>
          <Typography className="text-base" onClick={enableAlerts}>
            {isAlerts ? "вкл" : "выкл"}
          </Typography>
        </UserSettingOption>
        <UserSettingOption title="История тредов" imageSrc={Paper.src}>
          <Typography className="text-base" onClick={setAutoSaveThreads}>
            {preferences.autoSaveThreads ? "вкл" : "выкл"}
          </Typography>
        </UserSettingOption>
      </div>
    </div>
  );
};
