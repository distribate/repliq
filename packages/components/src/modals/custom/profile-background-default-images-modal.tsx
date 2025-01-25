import { Image } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DynamicModal } from '../dynamic-modal.tsx';
import {
  CoverImageInput,
  useControlCoverImage,
  USER_COVER_DELETE_IMAGE_MUTATION_KEY,
} from '#profile/components/cover/hooks/use-control-cover-image.ts';
import { defaultImagesQuery } from '#profile/components/cover/queries/default-images-query.ts';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

const BackgroundImagesList = () => {
  const { data: defaultImages, isLoading } = defaultImagesQuery();
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  
  if (isLoading) return (
    <>
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
      <Skeleton className="w-full h-full" />
    </>
  );
  
  const handleCoverImageInput = ({
    fileName,
  }: Pick<CoverImageInput, 'fileName'>) => {
    if (!fileName) return;
    
    return uploadBackgroundImageMutation.mutate({
      file: null,
      customFilename: fileName,
    });
  };
  
  if (!defaultImages) return null;
  
  return defaultImages.map(({ path, signedUrl }, i) => (
    <div
      className="flex flex-col rounded-lg overflow-hidden border border-shark-800 relative
      hover:bg-secondary-color cursor-pointer group transition-all duration-150 w-full"
      key={i}
      onClick={() => handleCoverImageInput({ fileName: path })}
    >
      <img
        src={signedUrl}
        alt={path}
        height={900}
        width={1200}
        loading="lazy"
        className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
      />
    </div>
  ));
};

export const ProfileBackgroundDefaultImagesModal = () => {
  return (
    <DynamicModal
      contentClassName="max-w-6xl"
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <HoverCardItem className="w-full gap-2 p-6 group items-center">
          <Image size={24} className="text-shark-300" />
          <Typography textSize="medium" textColor="shark_white">
            Выбрать из библиотеки
          </Typography>
        </HoverCardItem>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography textSize="big" textColor="shark_white">
            Библиотека
          </Typography>
          <div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
            <BackgroundImagesList />
          </div>
        </div>
      }
    />
  );
};