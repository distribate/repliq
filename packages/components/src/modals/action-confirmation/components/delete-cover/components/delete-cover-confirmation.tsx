import { ConfirmationActionModalTemplate } from '../../../../../templates/confirmation-action-modal-template.tsx';
import { ConfirmationButton } from '../../../../../buttons/confirmation-action-button.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import {
  useControlCoverImage
} from '../../../../../profile/components/cover/components/cover-image/hooks/use-control-cover-image.tsx';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { DELETE_COVER_MODAL_NAME } from './delete-cover-modal.tsx';

export const DeleteCoverConfirmation = () => {
  const { removeDialogMutation } = useDialog()
  const { deleteBackgroundImageMutation } = useControlCoverImage();
  
  
  const handleDeleteCover = () => {
    deleteBackgroundImageMutation.mutate();
  };
  
  return (
    <ConfirmationActionModalTemplate title="Подтверждение действия">
      <ConfirmationButton
        title="Удалить"
        actionType="continue"
        onClick={handleDeleteCover}
        disabled={deleteBackgroundImageMutation.isPending}
        pending={deleteBackgroundImageMutation.isPending}
      />
      <ConfirmationButton
        title="Отмена"
        actionType="cancel"
        disabled={deleteBackgroundImageMutation.isPending}
        onClick={() => removeDialogMutation.mutate(DELETE_COVER_MODAL_NAME)}
      />
    </ConfirmationActionModalTemplate>
  )
}