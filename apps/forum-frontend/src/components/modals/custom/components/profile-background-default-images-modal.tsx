import { Image } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DynamicModal } from '../../dynamic-modal/components/dynamic-modal.tsx';
import { Skeleton } from '@repo/ui/src/components/skeleton.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { reatomComponent } from '@reatom/npm-react';
import { CoverImageInput, uploadBackgroundImageAction } from '#components/profile/header/models/cover-image.model.ts';
import { imagesLibraryAction } from '#components/profile/header/models/cover-image.model.ts';

const BackgroundImagesList = reatomComponent(({ ctx }) => {
  const defaultImages = ctx.spy(imagesLibraryAction.dataAtom)

  if (ctx.spy(imagesLibraryAction.statusesAtom).isPending) {
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
    uploadBackgroundImageAction(ctx, { type: "default", fileName });
  };

  return (
    <>
      {!defaultImages && <Typography>Изображения не найдены</Typography>}
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
}, "BackgroundImagesList")

export const ProfileBackgroundDefaultImagesModal = reatomComponent(({ ctx }) => {
  return (
    <DynamicModal
      autoClose
      withLoader
      isPending={ctx.spy(uploadBackgroundImageAction.statusesAtom).isPending}
      contentClassName="max-w-6xl"
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
}, "ProfileBackgroundDefaultImagesModal")