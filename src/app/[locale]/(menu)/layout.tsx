'use client';

import DatePicker from '@/components/DatePicker';
import { Link as NextLink, useRouter } from '@/i18n/navigation';
import { Button, Heading, HStack, Link, Text } from "@chakra-ui/react";
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { Fragment, useCallback, useMemo, type FC, type PropsWithChildren } from 'react';

function isToday(date: Date) {
  return date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
}

const MenuLayout: FC<PropsWithChildren> = ({ children }) => {
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
      <HStack spacing={3} display="inline-flex" alignItems="center" key="header">
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

      <Fragment key="content">
        {children}
      </Fragment>
    </>
  );
}

export default MenuLayout;
