'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { UtensilsCrossed, TrendingUp, Home } from 'lucide-react';
import { useParams } from 'next/navigation';
import { venues } from '@/config/venues.client';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

function getNavItems(venueId: string): NavItem[] {
  return [
    { href: `/${venueId}`, labelKey: 'menu', icon: <UtensilsCrossed className="h-4 w-4" /> },
    { href: `/${venueId}/analytics`, labelKey: 'analytics', icon: <TrendingUp className="h-4 w-4" /> },
  ];
}

interface SidebarProps {
  className?: string;
  onNavClick?: () => void;
  isCollapsed?: boolean;
}

const Sidebar = ({ className, onNavClick, isCollapsed = false }: SidebarProps) => {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations('nav');
  
  // Get current venue from URL params, or use first venue as default
  const currentVenueId = (params.venue as string) || venues[0]?.id || 'bcvt';
  const currentVenue = venues.find(v => v.id === currentVenueId);
  const navItems = getNavItems(currentVenueId);

  return (
    <aside className={cn('flex flex-col gap-2 p-4', className)}>
      {/* Venue indicator */}
      {currentVenue && (
        <div className="px-3 py-2 mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Venue</p>
          <p className="font-semibold text-sm">{currentVenue.name}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const label = t(item.labelKey);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              title={isCollapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isCollapsed ? 'justify-center' : 'gap-3',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Global links (when multiple venues exist) */}
      {venues.length > 1 && (
        <div className="mt-auto pt-4 border-t space-y-1">
          <Link
            href="/compare"
            onClick={onNavClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              pathname === '/compare' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}
          >
            <TrendingUp className="h-4 w-4" />
            {t('compare')}
          </Link>
          <Link
            href="/"
            onClick={onNavClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
            )}
          >
            <Home className="h-4 w-4" />
            {t('allVenues')}
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
