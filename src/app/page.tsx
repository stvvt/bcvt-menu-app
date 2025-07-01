'use client';

import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
    >
      <VStack spacing={8} textAlign="center">
        <Heading size="2xl" color="brand.500">
          Welcome to Next.js with Chakra UI
        </Heading>
        
        <Text fontSize="lg" color="gray.600" maxW="md">
          Your Next.js app is now set up with TypeScript, App Router, src directory, and Chakra UI v2 with a custom theme.
        </Text>
        
        <HStack spacing={4}>
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
