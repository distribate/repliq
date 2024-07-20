import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { ImageWrapper } from '../wrappers/image-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  UserProfileSettings
} from '../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import BookAndQuill from "@repo/assets/images/minecraft/book_quill.webp"

export const PROFILE_SETTINGS_MODAL_NAME = "profile-settings"

export const ProfileSettingsModal = () => {
  return (
    <DialogWrapper
      name={PROFILE_SETTINGS_MODAL_NAME}
      trigger={
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
      }
    >
      <UserProfileSettings/>
    </DialogWrapper>
  )
}