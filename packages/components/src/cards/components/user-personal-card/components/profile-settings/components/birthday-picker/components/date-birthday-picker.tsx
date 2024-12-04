import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useCallback, useMemo, useState } from "react";
import { Calendar } from "@repo/ui/src/components/calendar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@repo/lib/utils/ui/cn.ts";
import { ru } from "date-fns/locale";
import { Matcher } from "react-day-picker";
import { MonthYearPicker } from "#cards/components/user-personal-card/components/profile-settings/components/birthday-picker/components/month-picker.tsx";
import { PickerType } from "#cards/components/user-personal-card/components/profile-settings/components/birthday-picker/types/birthday-picker-types.ts";
import {
  changeDayWithinRange,
  getEndMonth,
  getInitialDate,
  getMaxDate,
  getMinDate,
  getNextMonth,
  getPreviousMonth,
  parseDateOrTimestamp,
} from "#cards/components/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";

type BirthdayPicker = {
  init: Date | null;
};

function areDatesEqual(date1: Date, date2: Date): boolean {
  return date1.getTime() !== date2.getTime();
}

export const DateBirthdayPicker = ({ init }: BirthdayPicker) => {
  const initDate = getInitialDate(init);
  const [date, setDate] = useState<Date>(initDate || new Date());
  const [month, setMonth] = useState<Date>(initDate);
  const [monthYearPicker, setMonthYearPicker] = useState<PickerType | false>(
    false,
  );
  const { updateFieldMutation } = useUpdateCurrentUser();

  const handleSaveBirthday = () => {
    const parsedDate = parseDateOrTimestamp(date);

    if (!parsedDate || parsedDate === initDate) return;

    return updateFieldMutation.mutate({
      value: parsedDate as string,
      field: "birthday",
    });
  };

  const min = useMemo(() => getMinDate(), []);
  const max = useMemo(() => getMaxDate(), []);
  const endMonth = useMemo(() => getEndMonth(month), [month]);

  const onDayChanged = useCallback(
    (d: Date) => {
      setDate(changeDayWithinRange(d, date, min, max));
    },
    [date, min, max],
  );

  const onMonthYearChanged = useCallback((d: Date, mode: PickerType) => {
    setMonth(d);
    setMonthYearPicker(mode === "year" ? "month" : false);
  }, []);

  const onNextMonth = useCallback(
    () => setMonth(getNextMonth(month, max)),
    [month, max],
  );
  const onPrevMonth = useCallback(
    () => setMonth(getPreviousMonth(month, min)),
    [month, min],
  );

  const isValid = areDatesEqual(date, initDate);

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography variant="dialogTitle">День рождения</Typography>
      <div className="flex flex-col gap-2 justify-center p-3 w-[360px]">
        <div className="flex items-center justify-between w-full gap-4">
          <div
            className={`${monthYearPicker ? "bg-shark-700/20" : "bg-transparent"}
             hover:bg-shark-700/20 transition-all rounded-md px-4 py-2 gap-2 text-md font-bold ms-2 flex items-center cursor-pointer`}
          >
            <span
              onClick={() =>
                setMonthYearPicker(
                  monthYearPicker === "month" ? false : "month",
                )
              }
            >
              {format(month, "MMMM", { locale: ru })}
            </span>
            <span
              onClick={() =>
                setMonthYearPicker(monthYearPicker === "year" ? false : "year")
              }
            >
              {format(month, "yyyy", { locale: ru })}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div
              onClick={onPrevMonth}
              className="p-2 hover:bg-shark-700/20 rounded-md cursor-pointer"
            >
              <ChevronLeftIcon size={20} className="text-shark-300" />
            </div>
            <div
              onClick={onNextMonth}
              className="p-2 hover:bg-shark-700/20 rounded-md cursor-pointer"
            >
              <ChevronRightIcon size={20} className="text-shark-300" />
            </div>
          </div>
        </div>
        <div className="flex relative items-start h-[320px] justify-center overflow-hidden w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && onDayChanged(d)}
            month={month}
            endMonth={endMonth}
            disabled={
              [
                max ? { after: max } : null,
                min ? { before: min } : null,
              ].filter(Boolean) as Matcher[]
            }
            onMonthChange={setMonth}
            className="w-full"
          />
          <MonthYearPicker
            value={month}
            mode={monthYearPicker as PickerType}
            onChange={onMonthYearChanged}
            minDate={min}
            maxDate={max}
            className={cn(
              "absolute bg-shark-950 w-[340px] p-2 rounded-md top-0 left-0 bottom-0 right-0",
              monthYearPicker ? "" : "hidden",
            )}
          />
        </div>
        <Button
          variant="positive"
          onClick={handleSaveBirthday}
          disabled={
            updateFieldMutation.isPending ||
            updateFieldMutation.isError ||
            !isValid
          }
          className="px-4 self-end w-fit"
        >
          <Typography>Сохранить</Typography>
        </Button>
      </div>
    </div>
  );
};
