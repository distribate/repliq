import { CloudUpload, ImageUp } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { HoverCardItem } from "@repo/ui/src/components/hover-card.tsx";
import { DynamicModal } from "../dynamic-modal.tsx";
import {
  useControlCoverImage,
  USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
} from "#profile/components/cover/hooks/use-control-cover-image.ts";
import { ChangeEvent } from "react";
import { ProfileBackgroundDefaultImagesModal } from "./profile-background-default-images-modal.tsx";

const ProfileBackgroundUploadCustom = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();

  const handleCoverImageInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files ? e.target.files[0] : null;

    if (!file) return;

    uploadBackgroundImageMutation.mutate({ file, customFilename: null });
  };

  return (
    <HoverCardItem className="relative gap-2 p-6 items-center group">
      <CloudUpload size={24} className="text-shark-300" />
      <Typography textSize="medium" textColor="shark_white">
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
      contentClassName="max-w-xl"
      trigger={
        <HoverCardItem className="gap-2 items-center group">
          <ImageUp
            size={16}
            className="text-shark-300 group-hover:text-pink-500"
          />
          <Typography>Обновить фон</Typography>
        </HoverCardItem>
      }
      content={
        <div className="flex flex-col items-center gap-y-4 w-full">
          <Typography variant="dialogTitle">Обновление фона</Typography>
          <div className="flex flex-col items-center justify-center *:w-full w-full">
            <ProfileBackgroundDefaultImagesModal />
            <ProfileBackgroundUploadCustom />
          </div>
        </div>
      }
    />
  );
};
