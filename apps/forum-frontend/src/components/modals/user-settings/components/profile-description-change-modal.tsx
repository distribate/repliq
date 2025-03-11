import { UserProfileSettings } from "#components/cards/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";

export const ProfileDescriptionChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild className="w-1/2">
        <Button
          title="Настройка профиля"
          type="button"
          className="rounded-l-none px-6 hover:bg-shark-800"
        >
          <img
            src={BookAndQuill}
            width={24}
            className="w-[24px] h-[24px]"
            height={24}
            alt=""
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  );
};
