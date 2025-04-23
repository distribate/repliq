import { X } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { ConfirmationButton } from "#components/modals/confirmation-modal/components/confirmation-action-button.tsx";
import { ConfirmationActionModalTemplate } from "#components/modals/confirmation-modal/components/confirmation-action-modal.tsx";
import { DialogClose } from "@repo/ui/src/components/dialog.tsx";
import { DynamicModal } from "../../../../dynamic-modal/components/dynamic-modal.tsx";
import { getUser } from "@repo/lib/helpers/get-user.ts";
import { useControlCoverImage, USER_COVER_DELETE_IMAGE_MUTATION_KEY } from "@repo/lib/hooks/use-control-cover-image.ts";

export const DeleteCoverModal = () => {
  const { cover_image } = getUser();
  const { deleteBackgroundImageMutation } = useControlCoverImage();

  if (!cover_image) return null;

  return (
    <DynamicModal
      withLoader
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <div className="flex hover:bg-shark-600 rounded-md p-2 gap-2 items-center group">
          <X size={20} className="text-shark-300 group-hover:text-pink-500" />
          <Typography>Удалить фон</Typography>
        </div>
      }
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={() => deleteBackgroundImageMutation.mutate()}
            disabled={deleteBackgroundImageMutation.isPending}
            pending={deleteBackgroundImageMutation.isPending}
          />
          <DialogClose>
            <ConfirmationButton
              title="Отмена"
              actionType="cancel"
              disabled={deleteBackgroundImageMutation.isPending}
            />
          </DialogClose>
        </ConfirmationActionModalTemplate>
      }
    />
  );
};
