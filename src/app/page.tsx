'use client';

import { Box, Heading, VStack, Input } from "@chakra-ui/react";
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from 'react-datepicker';
import DailyMenu from '@/components/DailyMenu';
import 'react-datepicker/dist/react-datepicker.css';

export default function Home() {
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
          BCVT Menu for {selectedDate.toDateString()}
        </Heading>
        
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          customInput={
            <Input 
              placeholder="Select a date"
              size="lg"
              cursor="pointer"
              readOnly
            />
          }
          dateFormat="dd.MM.yyyy"
        />
        
        <DailyMenu date={selectedDate} />
      </VStack>
    </Box>
  );
}
