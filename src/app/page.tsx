'use client';

import { Box, Heading, VStack, Button, HStack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { format } from 'date-fns';
import DailyMenu from '@/components/DailyMenu';
import DatePicker from '@/components/DatePicker';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const selectedDate = dateParam ? new Date(dateParam) : new Date();

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const params = new URLSearchParams(searchParams);
      params.set('date', date.toISOString().split('T')[0]);
      router.push(`/?${params.toString()}`);
    }
  };

  return (
    <Box minH="100vh" p={8}>
      <VStack spacing={8} maxW="800px" mx="auto">
        <Heading size="xl" textAlign="center">
          BCVT Menu for{' '}
          <HStack spacing={3} display="inline-flex" alignItems="center">
            <Text>{format(selectedDate, 'dd.MM.yyyy')}</Text>
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
          </HStack>
        </Heading>
        
        <DailyMenu date={selectedDate} />
      </VStack>
    </Box>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Box p={8}>Loading...</Box>}>
      <HomeContent />
    </Suspense>
  );
}
