'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button, ButtonGroup } from '@chakra-ui/react';
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
    <ButtonGroup isAttached variant="outline" size="sm">
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          colorScheme={locale === loc ? 'blue' : 'gray'}
          variant={locale === loc ? 'solid' : 'outline'}
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default LanguageSwitcher; 