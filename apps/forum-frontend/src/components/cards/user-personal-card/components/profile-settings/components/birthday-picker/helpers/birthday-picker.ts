import {
  addMonths,
  format,
  getYear,
  getMonth,
  setYear,
  setMonth as setMonthFns,
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  subYears,
} from "date-fns";
import { TimeOption } from "#components/cards/user-personal-card/components/profile-settings/components/birthday-picker/types/birthday-picker-types.ts";

export function parseDateOrTimestamp(
  input: string | null | Date,
): Date | string | null {
  if (!input) {
    return null;
  }

  if (typeof input === "string") {
    const date = new Date(input);

    if (isNaN(date.getTime())) {
      console.error("Invalid timestamp format");
      return null;
    }

    return date;
  } else if (input instanceof Date) {
    return input.toISOString();
  } else {
    console.error("Input must be a string or Date object");
    return null;
  }
}

export const getInitialDate = (init: Date | null) => init || new Date();

export const getMinDate = () => subYears(new Date(), 100);

export const getMaxDate = () => new Date();

export const getEndMonth = (month: Date) => setYear(month, getYear(month) + 1);

export const changeDayWithinRange = (
  d: Date,
  date: Date,
  min: Date,
  max: Date,
): Date => {
  d.setHours(date.getHours(), date.getMinutes(), date.getSeconds());

  if (d < min) {
    d.setHours(min.getHours(), min.getMinutes(), min.getSeconds());
  }
  if (d > max) {
    d.setHours(max.getHours(), max.getMinutes(), max.getSeconds());
  }

  return d;
};

export const generateYears = (
  value: Date,
  minDate?: Date,
  maxDate?: Date,
): TimeOption[] => {
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
};

export const generateMonths = (
  value: Date,
  minDate?: Date,
  maxDate?: Date,
): TimeOption[] => {
  const months: TimeOption[] = [];

  for (let i = 0; i < 12; i++) {
    let disabled = false;
    const startM = startOfMonth(setMonthFns(value, i));
    const endM = endOfMonth(setMonthFns(value, i));

    if (minDate && endM < minDate) disabled = true;
    if (maxDate && startM > maxDate) disabled = true;

    months.push({ value: i, label: format(new Date(0, i), "MMM"), disabled });
  }

  return months;
};

export const getNextMonth = (month: Date, max: Date) => {
  const nextMonth = addMonths(month, 1);
  return nextMonth <= max ? nextMonth : month;
};

export const getPreviousMonth = (month: Date, min: Date) => {
  const prevMonth = subMonths(month, 1);
  return prevMonth >= min ? prevMonth : month;
};
