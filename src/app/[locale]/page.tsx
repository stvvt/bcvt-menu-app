'use client';

import { Box, Heading, VStack, Button, HStack, Text, Link } from "@chakra-ui/react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { format } from 'date-fns';
import DailyMenu from '@/components/DailyMenu';
import DatePicker from '@/components/DatePicker';
import NextLink from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
    <Box minH="100vh" p={8}>
      <VStack spacing={8} maxW="800px" mx="auto">
          BCVT Menu for{' '}
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
            <Box flexGrow={1} textAlign="right">
              <LanguageSwitcher />
            </Box>
          </HStack>
        
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
