import { toast } from "sonner";
import { DeleteButton } from "@repo/ui/src/components/detele-button.tsx";
import { ALERTS_COOKIE_KEY } from "@repo/shared/keys/cookie";

export const AlertClose = () => {
  const handleShowAlerts = () => {
    toast.info("Объявления скрыты.", {
      description: "Вы можете их включить в настройках.",
    });

    return document.cookie = `${ALERTS_COOKIE_KEY}=hide`;
  };

  return <DeleteButton variant="invisible" onClick={handleShowAlerts} />;
};