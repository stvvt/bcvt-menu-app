'use client';

import { usePathname } from '@/i18n/navigation';
import ColorModeToggle from '@/components/ColorModeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MobileNav from '@/components/MobileNav';
import { getVenueClient } from '@/config/venues.client';

const TopBar = () => {
  const pathname = usePathname();
  const venueSlug = pathname.split('/').filter(Boolean)[0];
  const venue = venueSlug ? getVenueClient(venueSlug) : undefined;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-2 md:px-4">
        {/* Left: hamburger (mobile) + venue name */}
        <div className="flex items-center min-w-0">
          <div className="md:hidden shrink-0">
            <MobileNav />
          </div>
          {venue && (
            <span className="text-base font-medium truncate min-w-0" title={venue.name}>
              {venue.name}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <ColorModeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
