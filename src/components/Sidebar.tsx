'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { UtensilsCrossed } from 'lucide-react';

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/', labelKey: 'menu', icon: <UtensilsCrossed className="h-4 w-4" /> },
];

interface SidebarProps {
  className?: string;
  onNavClick?: () => void;
}

const Sidebar = ({ className, onNavClick }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <aside className={cn('flex flex-col gap-2 p-4', className)}>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {item.icon}
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
