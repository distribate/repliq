import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences";

export const AlertClose = () => {
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return <DeleteButton variant="invisible" onClick={() => updateShowingMutation.mutate("alerts")} />;
};