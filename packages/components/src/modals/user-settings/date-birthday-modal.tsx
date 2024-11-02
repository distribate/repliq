import {
  DateBirthdayPicker,
} from '#cards/components/user-personal-card/components/profile-settings/components/date-birthday-picker.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const DateBirthdayModal = () => {
  const currentUser = getUser();
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