import type { Metadata } from "next";
import "./globals.css";
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: "BCVT menu",
  description: "BCVT cantine menu historical browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
