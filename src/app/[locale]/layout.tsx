import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from '@/app/providers';
import type { FC, PropsWithChildren } from 'react';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

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
    <html lang={locale}>
      <body>
        <Providers>
          <NextIntlClientProvider>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
