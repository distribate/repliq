import { Image } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import {
  BackgroundDefaultImages
} from '../../profile/components/cover/components/cover-image/components/background-default-images.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';
import {
  USER_COVER_DELETE_IMAGE_MUTATION_KEY
} from '../../profile/components/cover/components/cover-image/hooks/use-control-cover-image.ts';

export const ProfileBackgroundDefaultImagesModal = () => {
  return (
    <DynamicModal
      contentClassName="max-w-6xl"
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <div className="flex w-full gap-x-2 p-6 group rounded-lg items-center group hover:bg-white/10">
          <Image size={24} className="text-shark-300 group-hover:text-pink-500" />
          <Typography textSize="medium" textColor="shark_white">Выбрать из библиотеки</Typography>
        </div>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography textSize="big" textColor="shark_white">Библиотека</Typography>
          <BackgroundDefaultImages />
        </div>
      }
    />
  )
}