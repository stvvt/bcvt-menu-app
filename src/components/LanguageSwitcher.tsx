'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Languages } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(`${pathname}?${searchParams}`, { locale: newLocale });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="justify-start text-left font-normal">
          <Languages className="mr-2 h-4 w-4" />
          {locale.toUpperCase()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col gap-1">
          {routing.locales.map((loc) => (
            <Button
              key={loc}
              variant={locale === loc ? 'secondary' : 'ghost'}
              size="sm"
              className="justify-start"
              onClick={() => handleLocaleChange(loc)}
            >
              {loc.toUpperCase()}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher; 