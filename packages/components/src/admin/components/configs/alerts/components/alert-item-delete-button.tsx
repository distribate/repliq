"use client";

import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useAlerts } from "../../../../../forms/create-alert/hooks/use-alerts.ts";

export const AlertItemDeleteButton = ({ id }: Pick<AlertEntity, "id">) => {
  const { deleteAlertMutation } = useAlerts();

  return (
    <DeleteButton
      title="Удалить"
      disabled={deleteAlertMutation.isPending}
      onClick={() => deleteAlertMutation.mutate(id)}
    />
  );
};
