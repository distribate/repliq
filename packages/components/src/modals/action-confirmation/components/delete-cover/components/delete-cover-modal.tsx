import { DialogWrapper } from '../../../../../wrappers/dialog-wrapper.tsx';
import { DeleteCoverConfirmation } from './delete-cover-confirmation.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';
import { X } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export const DELETE_COVER_MODAL_NAME = "delete-cover"

export const DeleteCoverModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  if (!currentUser) return null;
  
  if (!currentUser.properties.cover_image) return null;
  
  return (
    <DialogWrapper
      name={DELETE_COVER_MODAL_NAME}
      trigger={
        <HoverCardItem
          className="gap-2 items-center group"
        >
          <X size={16} className="text-shark-300 group-hover:text-pink-500"/>
          <Typography>Удалить фон</Typography>
        </HoverCardItem>
      }
    >
      <DeleteCoverConfirmation/>
    </DialogWrapper>
  )
}