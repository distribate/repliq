import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { X } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ConfirmationButton } from '#buttons/confirmation-action-button.tsx';
import { ConfirmationActionModalTemplate } from '#templates/confirmation-action-modal-template.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { DynamicModal } from '../../../../dynamic-modal.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import {
  useControlCoverImage,
  USER_COVER_DELETE_IMAGE_MUTATION_KEY,
} from '#profile/components/cover/hooks/use-control-cover-image.ts';

export const DeleteCoverModal = () => {
  const currentUser = getUser();
  const { deleteBackgroundImageMutation } = useControlCoverImage();
  
  if (!currentUser) return null;

  const handleDeleteCover = () => {
    return deleteBackgroundImageMutation.mutate();
  };
  
  if (!currentUser.cover_image) return null;
  
  return (
    <DynamicModal
      withLoader
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <HoverCardItem className="gap-2 items-center group">
          <X size={16} className="text-shark-300 group-hover:text-pink-500" />
          <Typography>Удалить фон</Typography>
        </HoverCardItem>
      }
      content={
        <ConfirmationActionModalTemplate title="Подтверждение действия">
          <ConfirmationButton
            title="Удалить"
            actionType="continue"
            onClick={handleDeleteCover}
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