'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { subDays, subMonths } from 'date-fns';

export type DateRange = {
  from: Date;
  to: Date;
  label: string;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets: { label: string; getValue: () => Omit<DateRange, 'label'> }[] = [
  {
    label: 'Last 7 days',
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    label: 'Last 3 months',
    getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
  },
  {
    label: 'Last 6 months',
    getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
  },
  {
    label: 'Last year',
    getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
  },
  {
    label: 'All time',
    getValue: () => ({ from: new Date(2020, 0, 1), to: new Date() }),
  },
];

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    onChange({ ...range, label: preset.label });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          {value.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={value.label === preset.label ? 'secondary' : 'ghost'}
              className="justify-start"
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;

// Helper to get default date range
export function getDefaultDateRange(): DateRange {
  return {
    from: subMonths(new Date(), 3),
    to: new Date(),
    label: 'Last 3 months',
  };
}
