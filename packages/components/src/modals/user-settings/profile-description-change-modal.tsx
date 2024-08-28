import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import {
  UserProfileSettings
} from '../../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import BookAndQuill from '@repo/assets/images/minecraft/book_quill.webp';
import { PROFILE_SETTINGS_MODAL_NAME } from '../custom/profile-settings-modal.tsx';

export const ProfileDescriptionChangeModal = () => {
  return (
    <DialogWrapper
      name={PROFILE_SETTINGS_MODAL_NAME}
      trigger={
        <div className="rounded-md min-w-[30px] min-h-[30px] p-1 cursor-pointer">
          <ImageWrapper
            propSrc={BookAndQuill?.src}
            width={26}
            height={26}
            loading="eager"
            propAlt="Change description"
          />
        </div>
      }
    >
      <UserProfileSettings />
    </DialogWrapper>
  )
}