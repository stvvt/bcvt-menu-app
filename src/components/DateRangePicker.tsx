'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from 'lucide-react';
import { useState } from 'react';
import { subDays, subMonths } from 'date-fns';
import { useTranslations } from 'next-intl';

export type DateRange = {
  from: Date;
  to: Date;
  labelKey: string;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

type PresetKey = 'last7days' | 'last30days' | 'last3months' | 'last6months' | 'lastYear' | 'allTime';

const presets: { labelKey: PresetKey; getValue: () => Omit<DateRange, 'labelKey'> }[] = [
  {
    labelKey: 'last7days',
    getValue: () => ({ from: subDays(new Date(), 7), to: new Date() }),
  },
  {
    labelKey: 'last30days',
    getValue: () => ({ from: subDays(new Date(), 30), to: new Date() }),
  },
  {
    labelKey: 'last3months',
    getValue: () => ({ from: subMonths(new Date(), 3), to: new Date() }),
  },
  {
    labelKey: 'last6months',
    getValue: () => ({ from: subMonths(new Date(), 6), to: new Date() }),
  },
  {
    labelKey: 'lastYear',
    getValue: () => ({ from: subMonths(new Date(), 12), to: new Date() }),
  },
  {
    labelKey: 'allTime',
    getValue: () => ({ from: new Date(2020, 0, 1), to: new Date() }),
  },
];

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('dateRange');

  const handlePresetClick = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    onChange({ ...range, labelKey: preset.labelKey });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          {t(value.labelKey)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.labelKey}
              variant={value.labelKey === preset.labelKey ? 'secondary' : 'ghost'}
              className="justify-start"
              onClick={() => handlePresetClick(preset)}
            >
              {t(preset.labelKey)}
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
    labelKey: 'last3months',
  };
}
