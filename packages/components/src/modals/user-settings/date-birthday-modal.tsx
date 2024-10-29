import {
  DateBirthdayPicker,
} from '../../cards/components/user-personal-card/components/profile-settings/components/date-birthday-picker.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';

export const DateBirthdayModal = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  const birthday = currentUser?.birthday
  
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex items-center gap-1">
          <Typography className="text-base">
            {birthday ? birthday.toString() : `не указано`}
          </Typography>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DateBirthdayPicker />
      </DialogContent>
    </Dialog>
  );
};