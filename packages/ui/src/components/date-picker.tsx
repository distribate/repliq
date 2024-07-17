import {
  Button,
  Calendar, CalendarCell,
  CalendarGrid, CalendarGridBody,
  CalendarGridHeader, CalendarHeaderCell,
  DateInput, DatePickerProps, DatePicker,
  DateSegment, DateValue,
  Group,
  Heading,
  Label, ValidationResult,
} from 'react-aria-components';
import { DropdownWrapper } from '@repo/components/src/wrappers/dropdown-wrapper.tsx';
import { Separator } from './separator.tsx';
import { ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon } from 'lucide-react';

interface DatePicker<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const DatePickerWrapper = <T extends DateValue>({
  label, description, errorMessage, ...props
}: DatePicker<T>) => {
  return (
    <DatePicker className="group flex flex-col gap-1 w-[200px]" {...props}>
      <Label className="text-white cursor-default">{label}</Label>
      <Group className="flex justify-between items-center px-4 w-full
       rounded-md bg-shark-950 focus-within:bg-shark-950 group-open:bg-shark-950
       transition focus-visible:ring-2 ring-black"
      >
        <DateInput className="flex flex-1 py-2">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="px-0.5 tabular-nums outline-none rounded-sm focus:bg-violet-700 focus:text-white caret-transparent"
            />
          )}
        </DateInput>
        <DropdownWrapper
          properties={{ sideAlign: 'right', contentAlign: 'end' }}
          trigger={
            <ChevronsUpDownIcon size={16} className="text-shark-300" />
          }
          content={
            <Calendar className="flex flex-col gap-y-2 w-full">
              <header
                className="flex justify-between items-center rounded-md border-[1px] border-white/10 gap-1 px-2 w-full">
                <Button slot="previous" className="rounded-md p-0.5 hover:bg-white/10">
                  <ChevronLeftIcon size={18} />
                </Button>
                <Heading className="flex-1 font-semibold text-xl" />
                <Button slot="next" className="rounded-md p-0.5 hover:bg-white/10">
                  <ChevronRightIcon size={18} />
                </Button>
              </header>
              <Separator />
              <CalendarGrid className="border-spacing-1 border-separate">
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="text-base text-shark-300">{day}</CalendarHeaderCell>
                  )}
                </CalendarGridHeader>
                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className="w-6 h-6 outline-none cursor-default rounded-md p-0.5 flex items-center justify-center outside-month:text-shark-400
                        hover:bg-shark-100 pressed:bg-shark-200 selected:bg-caribbean-green-500 selected:text-white focus-visible:ring ring-caribbean-green-500/70
                        ring-offset-2"
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          }
        />
      </Group>
    </DatePicker>
  );
};