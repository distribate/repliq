"use client";

import { toast } from "sonner";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { disableAlerts } from "#alert/queries/disable-alerts.ts";

export const AlertClose = () => {
  const handleShowAlerts = () => {
    toast.info("Объявления выключены.", {
      description: "Вы можете их включить в настройках.",
    });

    return disableAlerts();
  };

  return <DeleteButton variant="invisible" onClick={handleShowAlerts} />;
};
