import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn } from "@repo/shared/utils/cn.ts";
import { ScrollArea } from "@repo/ui/src/components/scroll-area.tsx";
import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import {
  PickerType,
  TimeOption,
} from "#components/user/components/settings/profile/components/birthday-picker/types/birthday-picker-types";
import dayjs from "@repo/shared/constants/dayjs-instance"

type MonthYearPickerProps = {
  value: Date;
  mode: PickerType;
  minDate?: Date;
  maxDate?: Date;
  onChange: (value: Date, mode: PickerType) => void;
  className?: string;
};

export const MonthYearPicker = ({
  value, minDate, maxDate, mode = "month", onChange, className,
}: MonthYearPickerProps) => {
  const yearRef = useRef<HTMLDivElement>(null);
  const dayjsValue = dayjs(value);

  const years = useMemo(() => {
    const years: TimeOption[] = [];

    for (let i = 1924; i < 2025; i++) {
      let disabled = false;

      const startY = dayjsValue.set('year', i).startOf('year');
      const endY = dayjsValue.set('year', i).endOf('year');

      if (minDate && endY.isBefore(dayjs(minDate))) disabled = true;
      if (maxDate && startY.isAfter(dayjs(maxDate))) disabled = true;

      years.push({ value: i, label: i.toString(), disabled });
    }

    return years;
  }, [value]);

  const months = useMemo(() => {
    const months: TimeOption[] = [];

    for (let i = 0; i < 12; i++) {
      let disabled = false;
      const startM = dayjsValue.set('month', i).startOf('month');
      const endM = dayjsValue.set('month', i).endOf('month');

      if (minDate && endM.isBefore(dayjs(minDate))) disabled = true;
      if (maxDate && startM.isAfter(dayjs(maxDate))) disabled = true;

      months.push({
        value: i,
        label: dayjs().set('month', i).format("MMM"),
        disabled,
      });
    }

    return months;
  }, [dayjsValue, minDate, maxDate]);

  const onYearChange = useCallback((v: TimeOption) => {
    let newDate = dayjsValue.set('year', v.value).toDate();

    if (minDate && dayjs(newDate).isBefore(dayjs(minDate))) {
      newDate = dayjs(newDate).set('month', dayjs(minDate).month()).toDate();
    }

    if (maxDate && dayjs(newDate).isAfter(dayjs(maxDate))) {
      newDate = dayjs(newDate).set('month', dayjs(maxDate).month()).toDate();
    }

    onChange(newDate, "year");
  }, [onChange, dayjsValue, minDate, maxDate]);

  useEffect(() => {
    if (mode === "year") {
      yearRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [mode, value]);

  const selectMonth = (month: TimeOption) => {
    onChange(dayjsValue.set('month', month.value).toDate(), "month")
  }

  return (
    <div className={cn(className)}>
      <ScrollArea className="h-full">
        {mode === "year" && (
          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => (
              <div
                key={year.value}
                ref={year.value === dayjsValue.year() ? yearRef : undefined}
              >
                <Button
                  disabled={year.disabled}
                  className={`
                    flex px-4 py-2 rounded-md
                    ${dayjsValue.year() === year.value ? "bg-emerald-500/50" : "bg-shark-700/50 hover:bg-shark-700/80"}
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
                  ${dayjsValue.month() === month.value ? "bg-emerald-500/50" : "bg-shark-700/50 hover:bg-shark-700/80"}
                `}
                onClick={() => selectMonth(month)}
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