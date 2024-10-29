import { MutationKey, MutationStatus, useMutationState, useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { X } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import {
  useControlCoverImage, USER_COVER_DELETE_IMAGE_MUTATION_KEY,
} from '../../../../../profile/components/cover/components/cover-image/hooks/use-control-cover-image.tsx';
import { DialogClose } from '@repo/ui/src/components/dialog.tsx';
import { DynamicModal } from '../../../../dynamic-modal.tsx';

export const DeleteCoverModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  const { deleteBackgroundImageMutation } = useControlCoverImage();
  
  if (!currentUser) return null;

  const handleDeleteCover = () => {
    return deleteBackgroundImageMutation.mutate();
  };
  
  if (!currentUser.properties.cover_image) return null;
  
  return (
    <DynamicModal
      mutationKey={USER_COVER_DELETE_IMAGE_MUTATION_KEY}
      trigger={
        <HoverCardItem
          className="gap-2 items-center group"
        >
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