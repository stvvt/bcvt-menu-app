'use client';

import DailyMenu from '@/components/DailyMenu';
import DatePicker from '@/components/DatePicker';
import { Link as NextLink, useRouter } from '@/i18n/navigation';
import { Button, Heading, HStack, Link, Text } from "@chakra-ui/react";
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';

function isToday(date: Date) {
  return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      if (isToday(date)) {
        router.push(`/`);
      } else {
        const params = new URLSearchParams(searchParams);
        params.set('date', date.toISOString().split('T')[0]);
        router.push(`/?${params.toString()}`);
      }
    }
  };

  return (
    <>
      <HStack spacing={3} display="inline-flex" alignItems="center">
        <Heading size="lg" textAlign="center">
          <Text color="gray.500" as="span">BCVT Menu{' '}</Text>
          <strong>{format(selectedDate, 'dd.MM.yyyy')}</strong>
        </Heading>
        <DatePicker
          selected={selectedDate}
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
        {!isToday(selectedDate) && <Link href="/" color="blue.500" as={NextLink} fontSize="sm">today</Link>}
      </HStack>
      
      <DailyMenu date={selectedDate} />
    </>
  );
}

export default HomeContent;
