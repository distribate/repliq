import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useDialog } from '@repo/lib/hooks/use-dialog.ts';
import { useState } from 'react';
import { parseZonedDateTime } from '@internationalized/date';
import { DatePickerWrapper } from '@repo/ui/src/components/date-picker';

export const DateBirthdayPicker = () => {
  const { removeDialogMutation } = useDialog();
  let [ value, setValue ] = useState(parseZonedDateTime('2005-01-01T10:45[Europe/Moscow]'));
  
  const handleBirthday = () => {
    removeDialogMutation.mutate('birthday-picker');
  };
  
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography variant="dialogTitle">День рождения</Typography>
      <div className="flex justify-between items-start w-full gap-4 px-3">
        <DatePickerWrapper
          defaultValue={value}
          onChange={setValue}
          hideTimeZone={true}
        />
      </div>
    </div>
  );
};