import { UserSettingOption } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import GoldIngot from "@repo/assets/images/minecraft/gold_ingot.webp";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";

export const PasswordChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption title="Пароль" imageSrc={GoldIngot.src}>
          ...
        </UserSettingOption>
      </DialogTrigger>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
};
