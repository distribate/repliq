import { Typography } from '@repo/ui/src/components/typography.tsx';
import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  RealNameChange
} from '../../cards/components/user-personal-card/components/profile-settings/components/real-name-change/components/real-name-change.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const REAL_NAME_CHANGE_MODAL_NAME = "real-name-change"

export const RealNameChangeModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const realName = currentUser?.real_name
  
  return (
    <DialogWrapper
      name={REAL_NAME_CHANGE_MODAL_NAME}
      trigger={
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {realName ? realName : 'не указано'}
          </Typography>
        </div>
      }
    >
      <RealNameChange />
    </DialogWrapper>
  )
}