import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from '@/app/providers';
import type { FC, PropsWithChildren } from 'react';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import TopBar from '@/components/TopBar';
import SidebarContainer from '@/components/SidebarContainer';

export const metadata: Metadata = {
  title: "BCVT menu",
  description: "BCVT cantine menu historical browser",
};

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string }>
};

const RootLayout: FC<PropsWithChildren<Props>> = async ({ children, params }) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Read sidebar state from cookie for server-side rendering
  const cookieStore = await cookies();
  const sidebarCookie = cookieStore.get('sidebar-collapsed');
  const isSidebarCollapsed = sidebarCookie?.value !== 'false'; // default to collapsed

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        <Providers>
          <NextIntlClientProvider>
            <div className="min-h-screen flex flex-col">
              <TopBar />
              <div className="flex flex-1">
                {/* Desktop sidebar */}
                <SidebarContainer defaultCollapsed={isSidebarCollapsed} />
                {/* Main content area */}
                <main className="flex-1 p-4 md:p-8">
                  <div className="flex flex-col gap-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
