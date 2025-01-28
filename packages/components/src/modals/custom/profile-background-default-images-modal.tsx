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

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
        <Skeleton className="w-full h-full" />
      </>
    )
  }

  const handleCoverImageInput = (fileName: Pick<CoverImageInput, 'fileName'>["fileName"]) => {
    if (!fileName) return;

    uploadBackgroundImageMutation.mutate({ type: "default", fileName });
  };

  return (
    <>
      {!defaultImages && (
        <Typography>Изображения не найдены</Typography>
      )}
      {defaultImages && defaultImages.map(({ name, id, signedUrl }) => (
        <div
          key={id}
          className="flex flex-col rounded-lg overflow-hidden 
            border border-shark-800 relative hover:bg-secondary-color cursor-pointer group transition-all duration-150 w-full"
          onClick={() => handleCoverImageInput(name)}
        >
          <img
            src={signedUrl}
            alt={name}
            height={900}
            width={1200}
            loading="lazy"
            className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
          />
        </div>
      ))}
    </>
  );
};

export const ProfileBackgroundDefaultImagesModal = () => {
  return (
    <DynamicModal
      contentClassName="max-w-6xl"
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <HoverCardItem className="w-full gap-2 p-6 group items-center">
          <Image size={24} className="icon-color" />
          <Typography textSize="large" textColor="shark_white">
            Выбрать из библиотеки
          </Typography>
        </HoverCardItem>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography variant="dialogTitle" textColor="shark_white">
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