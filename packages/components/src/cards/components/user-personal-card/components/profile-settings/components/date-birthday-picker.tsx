import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useState } from 'react';
import { DateValue, parseZonedDateTime } from '@internationalized/date';
import { DatePickerWrapper } from '@repo/ui/src/components/date-picker';

export const DateBirthdayPicker = () => {
  let [ value, setValue ] = useState<DateValue>(parseZonedDateTime('2005-01-01T10:45[Europe/Moscow]'));
  
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography variant="dialogTitle">День рождения</Typography>
      <div className="flex justify-between items-start w-full gap-4 px-3">

      </div>
    </div>
  );
};