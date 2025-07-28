'use client';

import { Alert, AlertIcon  } from '@chakra-ui/react';

const ErrorPage = ({ error }: { error: Error } ) => {
  return (
    <Alert status="error" variant="subtle">
      <AlertIcon />
      {error.message}
    </Alert>
  );
};

export default ErrorPage;