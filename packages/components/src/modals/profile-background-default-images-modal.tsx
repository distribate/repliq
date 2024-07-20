import { DialogWrapper } from '../wrappers/dialog-wrapper.tsx';
import { Image } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { BACKGROUND_DEFAULT_IMAGES } from '@repo/shared/constants/background-default-images.ts';
import { ImageWrapper } from '../wrappers/image-wrapper.tsx';
import { HTMLAttributes } from 'react';
import {
  CoverImageInput,
  useControlCoverImage,
} from '../profile/components/cover/components/cover-image/hooks/use-control-cover-image.tsx';

interface LibraryBackgroundItemsProps
  extends HTMLAttributes<HTMLDivElement> {}

const LibraryBackgroundItem = ({
  children, ...props
}: LibraryBackgroundItemsProps) => {
  return (
    <div className="flex flex-col rounded-md overflow-hidden border-[1px] border-white/10 relative hover:bg-white/10
		 cursor-pointer group transition-all duration-150 w-full" {...props}>
      {children}
    </div>
  )
}

export const PROFILE_BACKGROUND_DEFAULT_IMAGES_MODAL_NAME = "profile-background-default-images"

export const ProfileBackgroundDefaultImagesModal = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  
  const handleCoverImageInput = ({
    fileName, type
  }: CoverImageInput) => {
    if (!type) return;
    
    if (type === 'library') {
      if (!fileName) return;
      
      return uploadBackgroundImageMutation.mutate({
        file: null,
        customFilename: 'default/' + fileName
      })
    }
  }
  
  return (
    <DialogWrapper
      name={PROFILE_BACKGROUND_DEFAULT_IMAGES_MODAL_NAME}
      properties={{ dialogContentClassName: "max-w-6xl" }}
      trigger={
        <div className="flex w-full gap-x-2 p-6 group rounded-l-md items-center group hover:bg-white/10">
          <Image size={24} className="text-shark-300 group-hover:text-pink-500"/>
          <Typography textSize="medium" textColor="shark_white">Выбрать из библиотеки</Typography>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-y-4 w-full">
        <Typography textSize="big" textColor="shark_white">Библиотека</Typography>
        <div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
          {BACKGROUND_DEFAULT_IMAGES.map((item, i) => (
            <LibraryBackgroundItem
              key={i}
              onClick={() => handleCoverImageInput({
                type: "library", fileName: item.value, file: null
              })}
            >
              <ImageWrapper
                propSrc={item.src}
                propAlt={item.title}
                height={900}
                width={1200}
                loading="lazy"
                className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
              />
              <Typography textShadow="small" className="absolute bottom-4 left-4 text-md font-medium text-shark-50">
                {item.title}
              </Typography>
            </LibraryBackgroundItem>
          ))}
        </div>
      </div>
    </DialogWrapper>
  )
}