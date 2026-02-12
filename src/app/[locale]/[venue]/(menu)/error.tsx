'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
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

  if (error.name === 'NotFoundError') {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          There is no menu data for this date.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        {error.message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorPage;
