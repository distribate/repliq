import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences";

export const AlertClose = () => {
  const { updateAlertsShowingMutation } = useUpdateGlobalPreferences()

  return <DeleteButton variant="invisible" onClick={() => updateAlertsShowingMutation.mutate()} />;
};