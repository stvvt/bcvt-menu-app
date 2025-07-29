import { getMenu } from '@/backend/getMenu';
import DailyMenu from '@/components/DailyMenu';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { Suspense, type FC } from 'react';

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" py={8}>
    <VStack spacing={4}>
      <Spinner size="lg" />
      <Text>Loading menu data...</Text>
    </VStack>
  </Box>
);


const HomeContent: FC<{ searchParams: Promise<{ date: string }> }> = async ({ searchParams }) => {
  const dateParam = await searchParams;

  const loadingDate = dateParam.date ? new Date(dateParam.date) : new Date();

  return (
    <Suspense key={loadingDate.toISOString()} fallback={<LoadingFallback />}>
      <DailyMenu menuData={getMenu(loadingDate)} refDate={loadingDate} />
    </Suspense>
  );
}

export default HomeContent;
