'use client';

import { useState } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import ColorModeToggle from '@/components/ColorModeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileNav from '@/components/MobileNav';
import { useTranslations } from 'next-intl';
import { useActiveVenues } from '@/contexts/ActiveVenuesContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('venues');
  const venues = useActiveVenues();
  const venueSlug = pathname.split('/').filter(Boolean)[0];
  const venue = venueSlug ? venues.find(v => v.id === venueSlug) : undefined;

  const handleVenueChange = (newVenueId: string) => {
    const segments = pathname.split('/').filter(Boolean);
    segments[0] = newVenueId;
    router.push(`/${segments.join('/')}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-2 md:px-4">
        <div className="flex items-center min-w-0">
          <div className="md:hidden shrink-0">
            <MobileNav />
          </div>
          {venue && (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-base font-medium truncate min-w-0">
                  {t(venue.id)}
                  <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="start">
                <div className="flex flex-col gap-1">
                  {venues.map((v) => (
                    <Button
                      key={v.id}
                      variant={v.id === venue.id ? 'secondary' : 'ghost'}
                      size="sm"
                      className="justify-start"
                      onClick={() => handleVenueChange(v.id)}
                    >
                      {t(v.id)}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <ColorModeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
