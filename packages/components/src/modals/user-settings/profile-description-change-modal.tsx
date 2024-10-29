import { ImageWrapper } from '../../wrappers/image-wrapper.tsx';
import {
  UserProfileSettings
} from '../../cards/components/user-personal-card/components/profile-settings/user-profile-settings.tsx';
import BookAndQuill from '@repo/assets/images/minecraft/book_quill.webp';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const ProfileDescriptionChangeModal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="rounded-md min-w-[30px] min-h-[30px] p-1 cursor-pointer">
          <ImageWrapper
            propSrc={BookAndQuill?.src}
            width={26}
            height={26}
            loading="eager"
            propAlt="Change description"
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <UserProfileSettings />
      </DialogContent>
    </Dialog>
  )
}