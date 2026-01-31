'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';

const STORAGE_KEY = 'sidebar-collapsed';

const SidebarContainer = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsCollapsed(stored === 'true');
    }
    setHasMounted(true);
  }, []);

  const toggleCollapsed = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(STORAGE_KEY, String(newValue));
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!hasMounted) {
    return (
      <aside className="hidden md:flex w-16 border-r bg-background sticky top-14 h-[calc(100vh-3.5rem)]" />
    );
  }

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
