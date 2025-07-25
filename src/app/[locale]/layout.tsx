import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from '@/app/providers';
import type { FC, PropsWithChildren } from 'react';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Box, VStack, HStack } from '@chakra-ui/react';
import { ColorModeScript } from '@chakra-ui/react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ColorModeToggle from '@/components/ColorModeToggle';
import { initialColorMode } from '@/app/theme';

export const metadata: Metadata = {
  title: "BCVT menu",
  description: "BCVT cantine menu historical browser",
};

type Props = {
  params: Promise<{ locale: string }>
};

const RootLayout: FC<PropsWithChildren<Props>> = async ({ children, params }) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ColorModeScript initialColorMode={initialColorMode} />
        <Providers>
          <NextIntlClientProvider>
            <Box position={{ md: 'fixed' }} top={{md: 2}} right={{md: 2}} zIndex={1000}>
              <HStack spacing={2}>
                <ColorModeToggle />
                <LanguageSwitcher />
              </HStack>
            </Box>
            <Box minH="100vh" p={{ base: 2, md: 8 }}>
              <VStack spacing={8} maxW="800px" mx="auto">
                {children}
              </VStack>
            </Box>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
