'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

const COOKIE_NAME = 'sidebar-collapsed';

interface SidebarContainerProps {
  defaultCollapsed?: boolean;
}

const SidebarContainer = ({ defaultCollapsed = true }: SidebarContainerProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    // Set cookie with 1 year expiry, accessible from all paths
    document.cookie = `${COOKIE_NAME}=${newValue}; path=/; max-age=31536000; SameSite=Lax`;
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col border-r bg-background transition-all duration-300',
        'sticky top-14 h-[calc(100vh-3.5rem)]',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <Sidebar isCollapsed={isCollapsed} className="flex-1" />
      <button
        onClick={toggleCollapsed}
        className={cn(
          'flex items-center justify-center p-3 border-t',
          'text-muted-foreground hover:text-foreground hover:bg-accent',
          'transition-colors'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
};

export default SidebarContainer;
