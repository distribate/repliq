import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { TimeOption } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/types/birthday-picker-types.ts";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(utc);

export function parseDateOrTimestamp(input: string | null | Date): dayjs.Dayjs | string | null {
  if (!input) {
    return null;
  }
  if (typeof input === "string") {
    const date = dayjs(input);
    if (!date.isValid()) {
      console.error("Invalid timestamp format");
      return null;
    }
    return date;
  } else if (input instanceof Date) {
    return dayjs(input).toISOString();
  } else {
    console.error("Input must be a string or Date object");
    return null;
  }
}

export const getInitialDate = (init: Date | null) => dayjs(init) || dayjs();

export const getMinDate = () => dayjs().subtract(100, "year");

export const getMaxDate = () => dayjs();

export const getEndMonth = (month: dayjs.Dayjs) => month.add(1, "year");

export const changeDayWithinRange = (
  d: dayjs.Dayjs,
  date: dayjs.Dayjs,
  min: dayjs.Dayjs,
  max: dayjs.Dayjs
): dayjs.Dayjs => {
  let updated = d.hour(date.hour()).minute(date.minute()).second(date.second());
  if (updated.isBefore(min)) updated = updated.hour(min.hour()).minute(min.minute()).second(min.second());
  if (updated.isAfter(max)) updated = updated.hour(max.hour()).minute(max.minute()).second(max.second());
  return updated;
};

export const generateYears = (
  value: dayjs.Dayjs,
  minDate?: dayjs.Dayjs,
  maxDate?: dayjs.Dayjs
): TimeOption[] => {
  const years: TimeOption[] = [];
  for (let i = 1924; i < 2025; i++) {
    let disabled = false;
    const startY = dayjs(value).year(i).startOf("year");
    const endY = dayjs(value).year(i).endOf("year");
    if (minDate && endY.isBefore(minDate)) disabled = true;
    if (maxDate && startY.isAfter(maxDate)) disabled = true;
    years.push({ value: i, label: i.toString(), disabled });
  }
  return years;
};

export const generateMonths = (
  value: dayjs.Dayjs,
  minDate?: dayjs.Dayjs,
  maxDate?: dayjs.Dayjs
): TimeOption[] => {
  const months: TimeOption[] = [];
  for (let i = 0; i < 12; i++) {
    let disabled = false;
    const startM = value.month(i).startOf("month");
    const endM = value.month(i).endOf("month");
    if (minDate && endM.isBefore(minDate)) disabled = true;
    if (maxDate && startM.isAfter(maxDate)) disabled = true;
    months.push({ value: i, label: dayjs().month(i).format("MMM"), disabled });
  }
  return months;
};

export const getNextMonth = (month: dayjs.Dayjs, max: dayjs.Dayjs) => {
  const nextMonth = month.add(1, "month");
  return nextMonth.isBefore(max) || nextMonth.isSame(max) ? nextMonth : month;
};

export const getPreviousMonth = (month: dayjs.Dayjs, min: dayjs.Dayjs) => {
  const prevMonth = month.subtract(1, "month");
  return prevMonth.isAfter(min) || prevMonth.isSame(min) ? prevMonth : month;
};