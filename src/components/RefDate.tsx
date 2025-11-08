/**
 * A component that displays the reference date for the menu.
 * The reference date is the date of the menu that is displayed.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/DatePicker';
import { format, isToday } from 'date-fns';
import { Link as NextLink } from '@/i18n/navigation';

const RefDate: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const loadingDate = useMemo(() => dateParam ? new Date(dateParam) : new Date(), [dateParam]);

  const handleDateChange = useCallback((date: Date | null) => {
    date = date || new Date();
    const params = new URLSearchParams(searchParams);
    params.set('date', date.toISOString().split('T')[0]);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <>
      {format(loadingDate, 'dd.MM.yyyy')}
      <DatePicker
        selected={loadingDate}
        onChange={handleDateChange}
        customInput={
          <Button
            variant="outline"
            size="sm"
          >
            📅
          </Button>
        }
        dateFormat="dd.MM.yyyy"
      />
      {!isToday(loadingDate) && (
        <NextLink href="/" className="text-sm text-blue-500 hover:text-blue-700 underline">
          today
        </NextLink>
      )}
    </>
  );
};

export default RefDate;