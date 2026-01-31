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
  isCollapsed?: boolean;
}

const Sidebar = ({ className, onNavClick, isCollapsed = false }: SidebarProps) => {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <aside className={cn('flex flex-col gap-2 p-4', className)}>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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
    </aside>
  );
};

export default Sidebar;
