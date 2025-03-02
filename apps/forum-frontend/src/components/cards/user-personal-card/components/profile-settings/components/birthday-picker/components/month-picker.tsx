import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  endOfMonth,
  endOfYear,
  format,
  getMonth,
  getYear,
  setYear,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { setMonth as setMonthFns } from "date-fns/setMonth";
import { ru } from "date-fns/locale";
import { cn } from "@repo/lib/utils/ui/cn.ts";
import { ScrollArea } from "@repo/ui/src/components/scroll-area.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  PickerType,
  TimeOption,
} from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/types/birthday-picker-types.ts";

type MonthYearPickerProps = {
  value: Date;
  mode: PickerType;
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date, mode: PickerType) => void;
  className?: string;
};

export const MonthYearPicker = ({
  value,
  minDate,
  maxDate,
  mode = "month",
  onChange,
  className,
}: MonthYearPickerProps) => {
  const yearRef = useRef<HTMLDivElement>(null);

  const years = useMemo(() => {
    const years: TimeOption[] = [];

    for (let i = 1924; i < 2025; i++) {
      let disabled = false;

      const startY = startOfYear(setYear(value, i));
      const endY = endOfYear(setYear(value, i));

      if (minDate && endY < minDate) disabled = true;
      if (maxDate && startY > maxDate) disabled = true;

      years.push({ value: i, label: i.toString(), disabled });
    }

    return years;
  }, [value]);

  const months = useMemo(() => {
    const months: TimeOption[] = [];

    for (let i = 0; i < 12; i++) {
      let disabled = false;
      const startM = startOfMonth(setMonthFns(value, i));
      const endM = endOfMonth(setMonthFns(value, i));

      if (minDate && endM < minDate) disabled = true;
      if (maxDate && startM > maxDate) disabled = true;

      months.push({
        value: i,
        label: format(new Date(0, i), "MMM", { locale: ru }),
        disabled,
      });
    }

    return months;
  }, [value]);

  const onYearChange = useCallback(
    (v: TimeOption) => {
      let newDate = setYear(value, v.value);
      if (minDate && newDate < minDate) {
        newDate = setMonthFns(newDate, getMonth(minDate));
      }
      if (maxDate && newDate > maxDate) {
        newDate = setMonthFns(newDate, getMonth(maxDate));
      }
      onChange(newDate, "year");
    },
    [onChange, value, minDate, maxDate],
  );

  useEffect(() => {
    if (mode === "year") {
      yearRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [mode, value]);

  return (
    <div className={cn(className)}>
      <ScrollArea className="h-full">
        {mode === "year" && (
          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => (
              <div
                key={year.value}
                ref={year.value === getYear(value) ? yearRef : undefined}
              >
                <Button
                  disabled={year.disabled}
                  className={`
                    flex px-4 py-2 rounded-md
                    ${getYear(value) === year.value ? "bg-emerald-500/50" : "bg-shark-700/50 hover:bg-shark-700/80"}
                  `}
                  onClick={() => onYearChange(year)}
                >
                  <Typography textColor="shark_white" textSize="medium">
                    {year.label}
                  </Typography>
                </Button>
              </div>
            ))}
          </div>
        )}
        {mode === "month" && (
          <div className="grid grid-cols-3 gap-2">
            {months.map((month) => (
              <Button
                key={month.value}
                disabled={month.disabled}
                className={`
                  flex px-4 py-2 rounded-md
                  ${getMonth(value) === month.value ? "bg-emerald-500/50" : "bg-shark-700/50 hover:bg-shark-700/80"}
                `}
                onClick={() =>
                  onChange(setMonthFns(value, month.value), "month")
                }
              >
                <Typography textColor="shark_white" textSize="medium">
                  {month.label}
                </Typography>
              </Button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
