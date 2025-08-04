'use client'

import clientConfig from '@/config/client'
import Script from 'next/script'

// Declare gtag as global function
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${clientConfig.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${clientConfig.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  )
}