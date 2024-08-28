
import { Image } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  BackgroundDefaultImages
} from '../../profile/components/cover/components/cover-image/components/background-default-images.tsx';

export const PROFILE_BACKGROUND_DEFAULT_IMAGES_MODAL_NAME = "profile-background-default-images"

export const ProfileBackgroundDefaultImagesModal = () => {
  return (
    <DialogWrapper
      name={PROFILE_BACKGROUND_DEFAULT_IMAGES_MODAL_NAME}
      properties={{ dialogContentClassName: "max-w-6xl" }}
      trigger={
        <div className="flex w-full gap-x-2 p-6 group rounded-lg items-center group hover:bg-white/10">
          <Image size={24} className="text-shark-300 group-hover:text-pink-500"/>
          <Typography textSize="medium" textColor="shark_white">Выбрать из библиотеки</Typography>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-y-4 w-full">
        <Typography textSize="big" textColor="shark_white">Библиотека</Typography>
        <BackgroundDefaultImages/>
      </div>
    </DialogWrapper>
  )
}