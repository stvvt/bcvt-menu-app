'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(`${pathname}?${searchParams}`, { locale: newLocale });
  };

  return (
    <div className="flex">
      {routing.locales.map((loc, index) => (
        <Button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          variant={locale === loc ? 'default' : 'outline'}
          size="sm"
          className={`${
            index === 0 ? 'rounded-r-none' : index === routing.locales.length - 1 ? 'rounded-l-none' : 'rounded-none'
          } ${index > 0 ? 'border-l-0' : ''}`}
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSwitcher; 