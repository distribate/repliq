import { UserProfileSettings } from "#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";

export const ProfileDescriptionChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          title="Настройка профиля"
          type="button"
          className="rounded-l-none px-6 hover:bg-shark-800"
        >
          <ImageWrapper
            propSrc={BookAndQuill?.src}
            width={24}
            className="w-[24px] h-[24px]"
            height={24}
            loading="lazy"
            propAlt=""
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  );
};
