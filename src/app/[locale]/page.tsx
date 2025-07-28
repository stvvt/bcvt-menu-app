'use client';

import DailyMenu from '@/components/DailyMenu';
import DatePicker from '@/components/DatePicker';
import { useMenuData } from '@/contexts/MenuDataContext';
import { Link as NextLink } from '@/i18n/navigation';
import { Button, Heading, HStack, Link, Text } from "@chakra-ui/react";
import { format } from 'date-fns';

function isToday(date: Date) {
  return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
}

function HomeContent() {
  const { loadingDate, changeDate } = useMenuData();

  return (
    <>
      <HStack spacing={3} display="inline-flex" alignItems="center">
        <Heading size="lg" textAlign="center">
          <Text color="gray.500" as="span">BCVT Menu{' '}</Text>
          <strong>{format(loadingDate, 'dd.MM.yyyy')}</strong>
        </Heading>
        <DatePicker
          selected={loadingDate}
          onChange={changeDate}
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
      
      <DailyMenu />
    </>
  );
}

export default HomeContent;
