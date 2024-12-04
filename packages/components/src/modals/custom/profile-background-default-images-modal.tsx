import { Image } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import { ImageWrapper } from "#wrappers/image-wrapper.tsx";
import {
  CoverImageInput,
  useControlCoverImage,
  USER_COVER_DELETE_IMAGE_MUTATION_KEY,
} from "#profile/components/cover/hooks/use-control-cover-image.ts";
import { defaultImagesQuery } from "#profile/components/cover/queries/default-images-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";

export const ProfileBackgroundDefaultImagesModal = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  const { data: defaultImages, isLoading } = defaultImagesQuery();

  const handleCoverImageInput = ({
    fileName,
  }: Pick<CoverImageInput, "fileName">) => {
    if (!fileName) return;

    return uploadBackgroundImageMutation.mutate({
      file: null,
      customFilename: fileName,
    });
  };

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
            {isLoading && (
              <>
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
                <Skeleton className="w-full h-full" />
              </>
            )}
            {!isLoading &&
              defaultImages &&
              defaultImages.map((image, i) => (
                <div
                  className="flex flex-col rounded-lg overflow-hidden border border-shark-800 relative
                  hover:bg-secondary-color cursor-pointer group transition-all duration-150 w-full"
                  key={i}
                  onClick={() =>
                    handleCoverImageInput({
                      // @ts-ignore
                      fileName: image.path, file: null,
                    })
                  }
                >
                  <ImageWrapper
                    // @ts-ignore
                    propSrc={image.signedUrl}
                    // @ts-ignore
                    propAlt={image.path}
                    height={900}
                    width={1200}
                    loading="lazy"
                    className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
                  />
                </div>
              ))}
          </div>
        </div>
      }
    />
  );
};
