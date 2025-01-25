import { INTRO_COOKIE_KEY } from "@repo/shared/keys/cookie";
import { DeleteButton } from "@repo/ui/src/components/detele-button";
import { toast } from "sonner";

export const IntroClose = () => {
  const handleShowIntro = () => {
    toast.info("Интро скрыто.", {
      description: "Вы можете снова включить его в настройках.",
    });

    return document.cookie = `${INTRO_COOKIE_KEY}=hide`;
  };

  return <DeleteButton variant="invisible" onClick={handleShowIntro} className="z-[3]" />;
};