import { useUpdateGlobalPreferences } from "@repo/lib/hooks/use-update-global-preferences";
import { DeleteButton } from "@repo/ui/src/components/detele-button";

export const IntroClose = () => {
  const { updateShowingMutation } = useUpdateGlobalPreferences()

  return <DeleteButton variant="invisible" onClick={() => updateShowingMutation.mutate("intro")} />;
};