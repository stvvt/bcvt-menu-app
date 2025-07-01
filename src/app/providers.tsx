'use client';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import type { FC, PropsWithChildren } from 'react';

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
};

export default Providers;
