import { CloudUpload, ImageUp } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ProfileBackgroundDefaultImagesModal } from './profile-background-default-images-modal.tsx';
import {
  CoverImageInput,
  useControlCoverImage, USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
} from '../../profile/components/cover/components/cover-image/hooks/use-control-cover-image.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';

export const ProfileBackgroundUpdateModal = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  
  const handleCoverImageInput = ({
    file, type
  }: Omit<CoverImageInput, "fileName">) => {
    if (!type || !file) return;
    
    if (type === 'origin') {
      return uploadBackgroundImageMutation.mutateAsync({ file });
    }
  }
  
  return (
    <DynamicModal
      withLoader
      mutationKey={USER_COVER_UPDATE_IMAGE_MUTATION_KEY}
      contentClassName="max-w-xl"
      trigger={
        <HoverCardItem className="gap-2 items-center group">
          <ImageUp size={16} className="text-shark-300 group-hover:text-pink-500"/>
          <Typography>Обновить фон</Typography>
        </HoverCardItem>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography textSize="big" textColor="shark_white">
            Доступные действия
          </Typography>
          <div className="flex flex-col items-center justify-center *:w-full w-full">
            <ProfileBackgroundDefaultImagesModal />
            <div className="flex relative gap-x-2 p-6 rounded-lg items-center group hover:bg-white/10">
              <CloudUpload size={24} className="text-shark-300 group-hover:text-pink-500" />
              <Typography textSize="medium" textColor="shark_white">
                Загрузить своё
              </Typography>
              <input
                type="file"
                id="file"
                className="absolute right-0 top-0 left-0 bottom-0 opacity-0 w-full"
                onChange={(e) => handleCoverImageInput({
                  type: 'origin', file: e.target?.files ? e.target.files[0] : null,
                })}
              />
            </div>
          </div>
        </div>
      }
    />
  )
}