'use client';

import { getMenu, type MealGroup } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import { Box, Spinner, Text, VStack } from "@chakra-ui/react";
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAsyncError } from '@/hooks/useAsyncError';

function HomeContent() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const throwError = useAsyncError();

  const loadingDate = useMemo(() => dateParam ? new Date(dateParam) : new Date(), [dateParam]);
  const [menuData, setMenuData] = useState<MealGroup[] | null>(null);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await getMenu(loadingDate);
        setMenuData(data);
      } catch (err) {
        if (!(err instanceof Error)) {
          throwError(new Error('Unknown error occurred'));
          return;
        }
        setMenuData(null);
        throwError(err);
      } finally {
        setDate(loadingDate);
      }
    }

    fetchMenu();
  }, [loadingDate, throwError]);

  return (
    <>
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
