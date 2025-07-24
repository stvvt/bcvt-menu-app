'use client';

import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { initialColorMode } from './theme';
import type { FC, PropsWithChildren } from 'react';

const config: ThemeConfig = {
  initialColorMode,
  useSystemColorMode: false,
}

const theme = extendTheme({ 
  config,
  colors: {
    // You can add custom colors that work well in both modes
  }
});

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>
};

export default Providers;
