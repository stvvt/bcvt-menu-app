import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" py={8}>
    <VStack spacing={4}>
      <Spinner size="lg" />
      <Text>Loading menu data...</Text>
    </VStack>
  </Box>
);

export default LoadingFallback;