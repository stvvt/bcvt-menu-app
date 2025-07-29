'use client';

import { Alert, AlertIcon  } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const ErrorPage = ({ error, reset }: { error: Error, reset: () => void } ) => {
  const searchParams = useSearchParams();
  const initialSearchParams = useRef(searchParams.toString());

  // Reset error boundary only when search params change from the initial error state
  useEffect(() => {
    const currentParams = searchParams.toString();
    if (currentParams !== initialSearchParams.current) {
      reset();
    }
  }, [searchParams, reset]);

  return (
    <Alert status="error" variant="subtle">
      <AlertIcon />
      {error.message}
    </Alert>
  );
};

export default ErrorPage;