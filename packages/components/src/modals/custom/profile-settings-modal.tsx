import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import BookAndQuill from '@repo/assets/images/minecraft/book_quill.webp';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';
import {
  UserProfileSettings,
} from '#cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const ProfileSettingsModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <HoverCardItem className="justify-between w-full">
          <div className="flex gap-x-2 items-center w-full">
            <ImageWrapper
              propSrc={BookAndQuill?.src}
              width={26}
              height={26}
              loading="eager"
              propAlt="Change description"
            />
            <Typography className="text-base">Профиль</Typography>
          </div>
        </HoverCardItem>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  );
};