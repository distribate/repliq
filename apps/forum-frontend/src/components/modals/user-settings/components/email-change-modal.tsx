import { UserSettingOption } from "#components/cards/user-setting-option-card/components/user-setting-option";
import BannerPattern from "@repo/assets/images/minecraft/banner_pattern.webp";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";

export const EmailChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <UserSettingOption title="Почта" imageSrc={BannerPattern}>
          ...
        </UserSettingOption>
      </DialogTrigger>
      <DialogContent>...</DialogContent>
    </Dialog>
  );
};
