import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from '@/app/providers';
import type { FC, PropsWithChildren } from 'react';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ColorModeToggle from '@/components/ColorModeToggle';
import GoogleAnalytics from '@/components/GoogleAnalytics';

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
        <GoogleAnalytics />
        <Providers>
          <NextIntlClientProvider>
            <div className="fixed top-2 right-2 z-50 md:block">
              <div className="flex items-center gap-2">
                <ColorModeToggle />
                <LanguageSwitcher />
              </div>
            </div>
            <div className="min-h-screen p-2 md:p-8">
              <div className="flex flex-col gap-8 max-w-3xl mx-auto">
                {children}
              </div>
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
