'use client';

import { getMenu, type MealGroup } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import DatePicker from '@/components/DatePicker';
import { Link as NextLink, useRouter } from '@/i18n/navigation';
import { Box, Button, Heading, HStack, Link, Spinner, Text, VStack } from "@chakra-ui/react";
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

function isToday(date: Date) {
  return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');

  const loadingDate = useMemo(() => dateParam ? new Date(dateParam) : new Date(), [dateParam]);
  const [menuData, setMenuData] = useState<MealGroup[] | null>(null);
  const [error, setError] = useState<Error>();
  const [date, setDate] = useState<Date>();

  const handleDateChange = useCallback((date: Date | null) => {
    date = date || new Date();
    const params = new URLSearchParams(searchParams);
    params.set('date', date.toISOString().split('T')[0]);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        setError(undefined);
        const data = await getMenu(loadingDate);
        setMenuData(data);
      } catch (err) {
        if (!(err instanceof Error)) {
          throw err;
        }
        setMenuData(null);
        setError(err);
      } finally {
        setDate(loadingDate);
      }
    }

    fetchMenu();

    return () => {
      setError(undefined);
    };
  }, [loadingDate]);

  if (error) {
    throw error;
  }

  return (
    <>
      <HStack spacing={3} display="inline-flex" alignItems="center">
        <Heading size="lg" textAlign="center">
          <Text color="gray.500" as="span">BCVT Menu{' '}</Text>
          <strong>{format(loadingDate, 'dd.MM.yyyy')}</strong>
        </Heading>
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
        {!isToday(loadingDate) && <Link href="/" color="blue.500" as={NextLink} fontSize="sm">today</Link>}
      </HStack>

      {!menuData ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <VStack spacing={4}>
            <Spinner size="lg" />
            <Text>Loading menu data...</Text>
          </VStack>
        </Box>
      ) : (
        <DailyMenu menuData={menuData} refDate={date!} />
      )}
    </>
  );
}

export default HomeContent;
