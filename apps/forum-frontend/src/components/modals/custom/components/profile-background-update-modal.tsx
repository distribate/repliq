import { CloudUpload, ImageUp } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DynamicModal } from "../../dynamic-modal/components/dynamic-modal.tsx";
import { ChangeEvent, Suspense, lazy } from "react";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import { useControlCoverImage, USER_COVER_UPDATE_IMAGE_MUTATION_KEY } from "@repo/lib/hooks/use-control-cover-image.ts";

const ProfileBackgroundDefaultImagesModal = lazy(() =>
  import("./profile-background-default-images-modal.tsx")
    .then(m => ({ default: m.ProfileBackgroundDefaultImagesModal }))
);

const ProfileBackgroundUploadCustom = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();

  const handleCoverImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : null;

    if (!file) return;

    uploadBackgroundImageMutation.mutate({ file, type: "custom" });
  };

  return (
    <HoverCardItem className="relative gap-2 p-6 items-center group">
      <CloudUpload size={24} className="icon-color" />
      <Typography textSize="large" textColor="shark_white">
        Загрузить своё
      </Typography>
      <input
        type="file"
        id="file"
        className="absolute right-0 top-0 left-0 bottom-0 opacity-0 w-full"
        onChange={handleCoverImageInput}
      />
    </HoverCardItem>
  );
};

export const ProfileBackgroundUpdateModal = () => {
  return (
    <DynamicModal
      withLoader
      mutationKey={USER_COVER_UPDATE_IMAGE_MUTATION_KEY}
      trigger={
        <div className="flex hover:bg-shark-600 rounded-md p-2 gap-2 items-center group">
          <ImageUp size={20} className="icon-color group-hover:text-pink-500" />
          <Typography>Обновить фон</Typography>
        </div>
      }
      content={
        <div className="flex flex-col items-center gap-4 w-full">
          <Typography variant="dialogTitle">
            Обновление фона
          </Typography>
          <div className="flex flex-col items-center p-2 justify-center *:w-full w-full">
            <Suspense fallback={<Skeleton className="h-10 w-full" />}>
              <ProfileBackgroundDefaultImagesModal />
            </Suspense>
            <ProfileBackgroundUploadCustom />
          </div>
        </div>
      }
    />
  );
};