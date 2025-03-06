import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useCallback, useMemo, useState } from "react";
import { Calendar } from "@repo/ui/src/components/calendar.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import dayjs from "@repo/lib/constants/dayjs-instance"
import { cn } from "@repo/lib/utils/ui/cn.ts";
import { Matcher } from "react-day-picker";
import { MonthYearPicker } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/components/month-picker.tsx";
import { PickerType } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/types/birthday-picker-types.ts";
import {
  changeDayWithinRange,
  getEndMonth,
  getInitialDate,
  getMaxDate,
  getMinDate,
  getNextMonth,
  getPreviousMonth,
  parseDateOrTimestamp,
} from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/helpers/birthday-picker.ts";
import { useUpdateCurrentUser } from "@repo/lib/hooks/use-update-current-user.ts";

type BirthdayPicker = {
  init: Date | null;
};

function areDatesEqual(date1: Date, date2: Date): boolean {
  return !dayjs(date1).isSame(date2, "day");
}

export const DateBirthdayPicker = ({ init }: BirthdayPicker) => {
  const initDate = getInitialDate(init ? init : new Date());
  const [date, setDate] = useState<dayjs.Dayjs>(initDate);
  const [month, setMonth] = useState<dayjs.Dayjs>(initDate);
  const [monthYearPicker, setMonthYearPicker] = useState<PickerType | false>(false);

  const { updateFieldMutation } = useUpdateCurrentUser();

  const handleSaveBirthday = () => {
    const parsedDate = parseDateOrTimestamp(date.toDate());

    if (!parsedDate || parsedDate === initDate) return;

    return updateFieldMutation.mutate({
      value: dayjs(parsedDate).format("YYYY-MM-DD"),
      criteria: "birthday",
    });
  };

  const min = useMemo(() => getMinDate(), []);
  const max = useMemo(() => getMaxDate(), []);
  const endMonth = useMemo(() => getEndMonth(month), [month]);

  const onDayChanged = useCallback((d: Date) => {
    setDate(changeDayWithinRange(dayjs(d), date, min, max));
  }, [date, min, max]);

  const onMonthYearChanged = useCallback((d: Date, mode: PickerType) => {
    setMonth(dayjs(d));
    setMonthYearPicker(mode === "year" ? "month" : false);
  }, []);

  const onNextMonth = useCallback(() => {
    setMonth(getNextMonth(month, max));
  }, [month, max]);

  const onPrevMonth = useCallback(() => {
    setMonth(getPreviousMonth(month, min));
  }, [month, min]);

  const isValid = areDatesEqual(date.toDate(), initDate.toDate());

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <Typography variant="dialogTitle">День рождения</Typography>
      <div className="flex flex-col justify-center py-2 w-[360px]">
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
              {dayjs(month).format("MMMM")}
            </span>
            <span
              onClick={() =>
                setMonthYearPicker(monthYearPicker === "year" ? false : "year")
              }
            >
              {dayjs(month).format("YYYY")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div
              onClick={onPrevMonth}
              className="p-2 hover:bg-shark-700/20 rounded-md cursor-pointer"
            >
              <ChevronUpIcon size={20} className="text-shark-300 font-bold" />
            </div>
            <div
              onClick={onNextMonth}
              className="p-2 hover:bg-shark-700/20 rounded-md cursor-pointer"
            >
              <ChevronDownIcon size={20} className="text-shark-300 font-bold" />
            </div>
          </div>
        </div>
        <div className="flex relative items-start h-[300px] justify-center overflow-hidden w-full">
          <Calendar
            mode="single"
            selected={date.toDate()}
            onSelect={(d) => d && onDayChanged(d)}
            month={month.toDate()}
            endMonth={endMonth.toDate()}
            disabled={
              [
                max ? { after: max.toDate() } : null,
                min ? { before: min.toDate() } : null,
              ].filter(Boolean) as Matcher[]
            }
            onMonthChange={v => setMonth(dayjs(v))}
            className="w-full"
          />
          <MonthYearPicker
            value={month.toDate()}
            mode={monthYearPicker as PickerType}
            onChange={onMonthYearChanged}
            minDate={min.toDate()}
            maxDate={max.toDate()}
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
          className="mt-6 mb-2 px-4 self-end w-fit"
        >
          <Typography>Сохранить</Typography>
        </Button>
      </div>
    </div>
  );
};
