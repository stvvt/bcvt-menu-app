import { useCallback, useState } from 'react';

export function useAsyncError() {
  const [, setError] = useState();
  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, [setError]);
}
