import { DialogWrapper } from '../../wrappers/dialog-wrapper.tsx';
import {
  DateBirthdayPicker,
} from '../../cards/components/user-personal-card/components/profile-settings/components/date-birthday-picker.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';

export const DATE_BIRTHDAY_MODAL_NAME = 'birthday';

export const DateBirthdayModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const birthday = currentUser?.birthday
  
  return (
    <DialogWrapper
      name={DATE_BIRTHDAY_MODAL_NAME}
      trigger={
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {birthday ? birthday.toString() : `не указано`}
          </Typography>
        </div>
      }
    >
      <DateBirthdayPicker />
    </DialogWrapper>
  );
};